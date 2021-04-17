// POST
// Deleting previous field of file if already exists
// adding info of new subtitle file to db

// GET
// checking if file already exists for the specific movie and user, asks for users's response,
// if true, 200 status, 'key: 'previous added file key', result: true'
// else, 200 status, 'key: '', result: false'
// some db error, 500 status
const connection = require('../../../../../db/dbconfig');
import { v4 as uuidv4 } from 'uuid';
import nc from 'next-connect';
const handler = nc();
const jwt = require('jsonwebtoken');

interface ExtendedRequest {
	user: string;
	query: {
		movieId: Number;
		user: String;
	};
	body: {
		deleteKey: string;
		addKey: string;
	};
}

interface ExtendedResponse {
	cookie: (name: string, value: string) => void;
	status: any;
	json: any;
}

handler.use((req, res, next) => {
	const token = req.headers['auth-header-token'];
	if (!token) {
		return res.status(401).json({ message: 'Please login to add subtitle files', type: 'subtitle' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;
	} catch (err) {
		return res.status(402).json({ message: 'Please login again to add subtitle files', type: 'subtitle' });
	}
	next();
});

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
	try {
		if (req.body.deleteKey) {
			connection.query('DELETE FROM subtitles WHERE name = ?', req.body.deleteKey, (err: any) => {
				if (err) throw err;
			});
		}
		// adding new info
		const array = req.body.addKey.split('/');
		const data = {
			id: uuidv4(),
			user_id: array[0],
			movie_id: array[1],
			name: req.body.addKey,
			file_size: 33,
		};
		connection.query('INSERT INTO subtitles SET ?', data, (err: any, _results: any) => {
			if (err) throw err;
			return res.status(200).send('DB Success!');
		});
	} catch (err) {
		res.status(500).json({ message: 'Upload Failed!', type: 'subtitle' });
	}
});

handler.get<ExtendedRequest, ExtendedResponse>(async (req, res) => {
	try {
		connection.query(
			'SELECT name FROM subtitles WHERE movie_id = ? AND user_id = ?',
			[req.query.movieId, req.query.user],
			(err: any, results: string | any[]) => {
				if (err) throw err;
				if (results.length) {
					console.log(results);
					console.log(results[0]);
					console.log(results[0].name);
					return res.status(200).send({ key: results[0].name, result: true });
				} else {
					return res.status(200).send({ key: '', result: false });
				}
			}
		);
	} catch (err) {
		return res.status(500).json({ message: 'Upload failed', type: 'subtitle' });
	}
});

export default handler;
