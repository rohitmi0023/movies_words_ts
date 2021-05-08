const connection = require('../../db/dbconfig');
import initMiddleware from '../../lib/init-middleware';
import validateMiddleware from '../../lib/validate-middleware';
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const validateBody = initMiddleware(
	validateMiddleware(
		[
			check('username', 'Username is required').not().isEmpty(),
			check('email', 'Email is required').isEmail(),
			check('password', 'Please enter a password with 6 or more characters').isLength({
				min: 6,
			}),
		],
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
		const { username, email, password } = req.body;
		try {
			connection.query('SELECT email from users WHERE email = ?', email, (err, results) => {
				if (err) throw err;
				try {
					if (!results.length) {
						// new user
						const userId = uuidv4();
						const emailVerifyHash = crypto.createHmac('sha256', 'a secret').update(userId).digest('hex');
						const trimmedEmail = email.trim();
						const avatar = gravatar.url(trimmedEmail, {
							s: '200',
							r: 'pg',
							d: 'mm',
						});
						bcrypt.hash(password, 10, async (err, hash) => {
							let data = {
								id: userId,
								username,
								email: trimmedEmail,
								password: hash,
								email_hash: emailVerifyHash,
								avatar,
							};
							connection.query('INSERT INTO users SET ?', [data], (err, results) => {
								if (err) throw err;
								jwt.sign(
									{
										userId: userId,
										exp: Math.floor(Date.now() / 1000) + 60 * 60,
									},
									process.env.JWT_SECRET,
									token => {
										const origin = req.headers.origin;
										main(emailVerifyHash, userId, email, origin).catch(console.error);
										return res.status(200).send({ token, emailVerifyHash });
									}
								);
							});
						});
					} else {
						throw new Error('Email is already in use!');
					}
				} catch (error) {
					return res.status(400).json({
						errors: [{ msg: error.message, param: 'email' }],
					});
				}
			});
		} catch (error) {
			return res.status(400).json({ errors: [{ msg: error.message, param: 'unknown' }] });
		}
	}
};

async function main(emailVerifyHash, userId, email, origin) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const link = `${origin}/auth/verify/${userId}?q=${emailVerifyHash}`;
	const msg = {
		to: email,
		from: 'rohitracer0023@gmail.com',
		subject: 'Verification',
		text: 'Verify your account',
		html: `<div><h3>Thanks for signing up! Please click the link below to verify your account.</h3><br/><a href=${link}><b>Click to verify</b></a></div>`,
	};
	sgMail.send(msg).then(
		() => {
			console.log(`Success in email sending!`);
		},
		error => {
			console.error(error);
			if (error.response) {
				console.error(error.response.body);
			}
		}
	);
}
