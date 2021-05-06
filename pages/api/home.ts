const connection = require('../../db/dbconfig');

export default async (req, res) => {
	if (req.method === 'GET') {
		console.log(req.query.q);
		try {
			connection.query(
				`select movies_details.poster_path, movies_details.title, movies_word.word, movies_word.added_by, movies_word.upvotes from 
				movies_details inner join movies_word on movies_details.id = movies_word.movie_id WHERE movies_word.profane = 0 order by RAND() limit ${req.query.q}`,
				async (err, results) => {
					if (err) throw err;
					if (results.length) {
						res.status(200).send(results);
					} else {
						res.status(404).send(
							'<h3>No word added yet in our database.</h3><h5>We will display random words from our database when we have words.</h5>'
						);
					}
				}
			);
		} catch (err) {
			res.status(500).send('Server Errors');
		}
	}
};
