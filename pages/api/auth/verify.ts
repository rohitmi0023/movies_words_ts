// to verify the user from mail
const connection = require('../../../db/dbconfig');

export default (req, res) => {
	if (req.method === 'POST') {
		try {
			connection.query(`SELECT email_hash, is_Verified from users WHERE id = ?`, req.body.userId, (err, results) => {
				if (err) throw err;
				if (results.length) {
					if (results[0].is_Verified) {
						return res.status(200).send({ msg: 'Email has been already verified!' });
					}
					if (results[0].email_hash === req.body.userEmailHash) {
						connection.query('UPDATE users SET is_Verified = 1 WHERE  id = ?', req.body.userId, (err, results) => {
							if (err) throw err;
							return res.status(200).send({ msg: 'Email Verified!' });
						});
					} else {
						return res.status(400).send({ error: `Verification not matched` });
					}
				} else {
					return res.status(400).send({ error: `Verification not matched` });
				}
			});
		} catch (error) {
			return res.status(400).send({ error: error.msg });
		}
	}
};
