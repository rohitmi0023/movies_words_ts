const connection = require('../../db/dbconfig');
import initMiddleware from '../../lib/init-middleware';
import validateMiddleware from '../../lib/validate-middleware';
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const validateBody = initMiddleware(
	validateMiddleware(
		[check('email', 'Please include a valid email address').isEmail(), check('password', 'Password is required').not().isEmpty()],
		validationResult
	)
);

export default async (req, res) => {
	if (req.method === 'POST') {
		await validateBody(req, res);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		try {
			connection.query('SELECT id, email, password, is_Verified from users WHERE email = ?', email, async (err, results) => {
				if (err) throw err;
				try {
					if (results.length) {
						// Email is present
						try {
							if (results[0].is_Verified) {
								// Email is verified
								const match = await bcrypt.compare(password, results[0].password);
								if (match) {
									// password is correct
									// create token and send userId as payload
									jwt.sign({ userId: results[0].id }, process.env.JWT_SECRET, { expiresIn: '10000h' }, (err, token) => {
										if (err) throw err;
										return res.status(200).send({ jwtToken: token });
									});
								} else {
									// Incorrect password
									return res.status(400).json({
										errors: [
											{
												msg: 'Invalid Credentials',
												param: 'password',
											},
										],
									});
								}
							} else {
								throw new Error('Email has not been verified!');
							}
						} catch (err) {
							res.status(400).json({
								errors: [{ msg: err.message, param: 'email' }],
							});
						}
					} else {
						throw new Error('Invalid Credentials');
					}
				} catch (err) {
					res.status(400).json({ errors: [{ msg: err.message, param: 'email' }] });
				}
			});
		} catch (err) {
			res.status(400).json({ errors: [{ msg: 'err.message' }] });
		}
	}
};
