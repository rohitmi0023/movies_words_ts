// To fetch information about users

const connection = require('../../../db/dbconfig');
const jwt = require('jsonwebtoken');
import nc from 'next-connect';
const handler = nc();

interface ExtendedRequest {
	userId: any;
}
interface ExtendedResponse {
	cookie: (name: string, value: string) => void;
	json: any;
	status: any;
}

handler.use((req, res, next) => {
	const token = req.headers['auth-header-token'];
	if (!token) {
		return res.status(401).json({ msg: 'No token, authentication failed' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;
	} catch (err) {
		res.status(401).json({ msg: 'Please login again!' });
	}
	next();
});

handler.get<ExtendedRequest, ExtendedResponse>((req, res) => {
	try {
		connection.query('SELECT email, username, date_registered, avatar from `users` WHERE `id` = ?', [req.userId], (err, results) => {
			if (err) throw err;
			res.json({
				user: {
					id: req.userId,
					username: results[0].username,
					email: results[0].email,
					date_registered: results[0].date_registered,
					avatar: results[0].avatar,
				},
			});
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

export default handler;
