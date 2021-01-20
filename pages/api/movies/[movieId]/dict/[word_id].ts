// Route /api/movies/:id/dict/:word_id
// For upvoting and downvoting

const connection = require('../../../../../db/dbconfig');
const jwt = require('jsonwebtoken');
import nc from 'next-connect';
const handler = nc();
import { v4 as uuidv4 } from 'uuid';

interface ExtendedRequest {
	user: string;
	body: {
		vote: Number;
		userId: any;
		word_id: any;
	};
}
interface ExtendedResponse {
	cookie: (name: string, value: string) => void;
	status: any;
}

handler.use((req, res, next) => {
	const token = req.headers['auth-header-token'];
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization failed!' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;
	} catch (err) {
		return res.status(401).json({ msg: 'Invalid Token' });
	}
	next();
});

handler.post<ExtendedRequest, ExtendedResponse>((req, res) => {
	if (req.body.vote === 1) {
		connection.query(
			'SELECT id from voting WHERE upvoted_by = ? AND word_id = ?',
			[req.body.userId, req.body.word_id],
			(err, results) => {
				if (err) throw err;
				if (results.length) {
					// user has already upvoted
					return res.status(401).send({ msg: 'You have already upvoted!' });
				} else {
					// a new vote
					connection.query(
						'UPDATE movies_word SET upvotes = upvotes + 1 WHERE id = ?',
						req.body.word_id,
						(err, results) => {
							if (err) throw err;
						}
					);
					// checking whether the user has downvoted this before
					connection.query(
						'SELECT id from voting WHERE downvoted_by = ? AND word_id = ?',
						[req.body.userId, req.body.word_id],
						(err, results) => {
							if (err) throw err;
							if (results.length) {
								// user has downvoted this word before, so just deleting it
								connection.query(
									'DELETE FROM voting WHERE downvoted_by = ? AND word_id = ?',
									[req.body.userId, req.body.word_id],
									(err, results) => {
										if (err) throw err;
										res.status(200).json({
											word_id: req.body.word_id,
										});
									}
								);
							} else {
								// user hasn't downvoted this word and upvoting for the first time
								const votingData = {
									id: uuidv4(),
									word_id: req.body.word_id,
									upvoted_by: req.body.userId,
								};
								connection.query(
									'INSERT INTO voting SET ?',
									votingData,
									(err, results) => {
										if (err) throw err;
										res.status(200).json({
											word_id: req.body.word_id,
										});
									}
								);
							}
						}
					);
				}
			}
		);
	} else {
		connection.query(
			'SELECT id from voting WHERE downvoted_by = ? AND word_id = ?',
			[req.body.userId, req.body.word_id],
			(err, results) => {
				if (err) throw err;
				if (results.length) {
					// user has already upvoted
					return res.status(401).send({ msg: 'You have already downvoted!' });
				} else {
					// a new vote
					connection.query(
						'UPDATE movies_word SET upvotes = upvotes - 1 WHERE id = ?',
						req.body.word_id,
						(err, results) => {
							if (err) throw err;
						}
					);
					// checking whether the user has upvoted this before
					connection.query(
						'SELECT id from voting WHERE upvoted_by = ? AND word_id = ?',
						[req.body.userId, req.body.word_id],
						(err, results) => {
							if (err) throw err;
							if (results.length) {
								// user has upvoted this word before, so just deleting it
								connection.query(
									'DELETE FROM voting WHERE upvoted_by = ? AND word_id = ?',
									[req.body.userId, req.body.word_id],
									(err, results) => {
										if (err) throw err;
										res.status(200).json({
											word_id: req.body.word_id,
										});
									}
								);
							} else {
								// user hasn't upvoted this word and downvoting for the first time
								const votingData = {
									id: uuidv4(),
									word_id: req.body.word_id,
									downvoted_by: req.body.userId,
								};
								connection.query(
									'INSERT INTO voting SET ?',
									votingData,
									(err, results) => {
										if (err) throw err;
										res.status(200).json({
											word_id: req.body.word_id,
										});
									}
								);
							}
						}
					);
				}
			}
		);
	}
});

export default handler;
