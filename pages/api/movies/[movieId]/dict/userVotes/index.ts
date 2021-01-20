// For fetching all the user specific votes
// /api/movies/:id/dict/userVotes

const connection = require('../../../../../../db/dbconfig');
import { v4 as uuidv4 } from 'uuid';

export default (req, res) => {
	if (req.method === 'GET') {
		const votes = {
			upvotes: null,
			downvotes: null,
		};
		const userId = req.query.userId;
		try {
			connection.query('SELECT word_id from voting WHERE upvoted_by = ?', userId, (err, results) => {
				if (err) throw err;
				votes.upvotes = results;
				connection.query('SELECT word_id from voting WHERE downvoted_by = ?', userId, (err, results) => {
					if (err) throw err;
					votes.downvotes = results;
					return res.status(200).json({ votes });
				});
			});
		} catch (err) {
			res.status(500).json({ message: 'Failed to load user votes', type: 'userVotes' });
		}
	}
};
