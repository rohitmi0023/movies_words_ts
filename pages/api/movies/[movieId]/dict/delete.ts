const connection = require('../../../../../db/dbconfig');
const jwt = require('jsonwebtoken');
import nc from 'next-connect';
const handler = nc();
import { v4 as uuidv4 } from 'uuid';

interface ExtendedRequest {
	user: string;
	body: {
		userId?: any;
		word: String;
		movieId: any;
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
		return res.status(401).json('Please login to delete word');
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;
	} catch (err) {
		return res.status(401).json('Please login again to delete word');
	}
	next();
});

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
	// console.log(req.body);
	try {
		connection.query('SELECT added_by FROM movies_word WHERE movie_id = ?', req.body.movieId, (err, results) => {
			if (err) throw err;
			if (results[0].added_by === req.body.userId) {
				if (results.length === 1) {
					// only one word, so have to delete from movies_details table too
					connection.query('DELETE FROM movies_details WHERE id = ?', req.body.movieId, (err, results) => {
						if (err) throw err;
					});
				}
				connection.query('DELETE FROM movies_word WHERE word = ? AND movie_id = ?', [req.body.word, req.body.movieId], (err, results) => {
					if (err) throw err;
					return res.status(200).send(`Successfully deleted ${req.body.word}!`);
				});
			} else {
				return res.status(500).send('You can only delete words added by you.');
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).send(`Failed to delete ${req.body.word}`);
	}
});

export default handler;
