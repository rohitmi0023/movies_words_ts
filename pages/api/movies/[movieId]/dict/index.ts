// Route /api/movies/:id/words
// For submitting and getting all the words

const connection = require('../../../../../db/dbconfig');
import initMiddleware from '../../../../../lib/init-middleware';
import validateMiddleware from '../../../../../lib/validate-middleware';
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
import nc from 'next-connect';
const handler = nc();
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
var Owlbot = require('owlbot-js');
var Filter = require('bad-words'),
	filter = new Filter();

interface ExtendedRequest {
	user: string;
	body: {
		currentMovie: {
			movieId: Number;
			adult: Number;
			homepage: String;
			title: String;
			original_title: String;
			original_language: String;
			popularity: Number;
			released_date: String;
			imdb_id: String;
			genre: String;
			poster_path: String;
			production_countries: String;
			runtime: Number;
			status: String;
			tagline: String;
			video: Number;
			vote_average: Number;
			vote_count: Number;
		};
		userId: any;
		word: String;
	};
	query: {
		movieId: any;
	};
}
interface ExtendedResponse {
	cookie: (name: string, value: string) => void;
	status: any;
	json: any;
}

// GET request for fetching all the words
handler.get<ExtendedRequest, ExtendedResponse>((req, res) => {
	try {
		let movie_id = req.query.movieId;
		connection.query('SELECT word, id, upvotes, added_by, profane from `movies_word` WHERE movie_id = ?', movie_id, (err, results) => {
			if (err) throw err;
			return res.status(200).send(results);
		});
	} catch (err) {
		return res.status(500).json({ message: 'Failed to load words!', type: 'wordsFetch' });
	}
});

handler.use((req, res, next) => {
	const token = req.headers['auth-header-token'];
	if (!token) {
		return res.status(401).json({ errors: [{ msg: 'Please login to add new word', param: 'word' }] });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;
	} catch (err) {
		return res.status(401).json({ errors: [{ msg: 'Please login again to add new word', param: 'word' }] });
	}
	next();
});

const validateBody = initMiddleware(
	validateMiddleware(
		[
			check('word')
				.isLength({ max: 25 })
				.withMessage('Word length exceeds 25!')
				.isLength({ min: 1 })
				.withMessage('Word cannot be empty!')
				.matches(/[A-Za-z]+$/)
				.withMessage('Word can contain only alphabets')
				.custom(async (value, { req }) => {
					const query = new Promise((resolve, reject) => {
						connection.query(
							'SELECT word from movies_word WHERE word = ? AND movie_id = ?',
							[value, req.body.movieId],
							(err, results) => {
								if (!_.isEmpty(results)) {
									return reject(`${value} is already added!`);
								} else {
									resolve(`${value} success!`);
								}
							}
						);
					});
					await query;
				}),
		],
		validationResult
	)
);

// To add a new word
handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
	try {
		await validateBody(req, res);
		console.log(`below validate body`);
		let {
			movieId,
			adult,
			homepage,
			title,
			original_title,
			original_language,
			popularity,
			released_date,
			imdb_id,
			genre,
			poster_path,
			production_countries,
			runtime,
			status,
			tagline,
			video,
			vote_average,
			vote_count,
		} = req.body.currentMovie;
		let userId = req.body.userId;
		let word = req.body.word;
		console.log(`below userId and word`);
		adult = true ? 1 : 0;
		video = true ? 1 : 0;
		var client = Owlbot(process.env.NEXT_PUBLIC_OWLBOT_API_KEY);
		await client.define(word); //for checking legit english words
		console.log(`below owlbot check`);
		const profanity = filter.isProfane(word); //returns true if word is profane
		console.log(`below profanity check`);
		let data = {
			id: movieId,
			adult,
			homepage,
			title,
			original_title,
			original_language,
			popularity,
			released_date,
			imdb_id,
			genre,
			poster_path,
			production_countries,
			runtime,
			status,
			tagline,
			video,
			vote_average,
			vote_count,
		};
		// movies_details table
		connection.query('SELECT id from `movies_details` WHERE `id` = ?', movieId, (err, results) => {
			if (err) throw err;
			if (!results.length) {
				// Movie isn't added yet, so adding the movie first
				connection.query('INSERT INTO movies_details SET ?', data, (error, results) => {
					if (err) throw err;
				});
			}
		});
		console.log(`below movies_details query`);
		// movies_word table
		connection.query(
			'SELECT word, movie_id from `movies_word` WHERE `word` = ? AND `movie_id` = ? ORDER BY upvotes DESC',
			[word, movieId],
			(err, results) => {
				if (err) throw err;
				if (!results.length) {
					// word isn't added yet
					const wordData = {
						id: uuidv4(),
						word: word,
						movie_id: movieId,
						added_by: userId,
						profane: profanity ? 1 : 0,
					};
					connection.query('INSERT INTO movies_word SET ?', wordData, (err, results) => {
						if (err) throw err;
						res.status(200).json({
							word: word,
							id: wordData.id,
							upvotes: 0,
							added_by: userId,
							profane: profanity ? 1 : 0,
						});
					});
				} else {
					// Word is already added
					return res.status(401).json({ errors: [{ msg: `${word} is already added!`, param: 'newWord' }] });
				}
			}
		);
	} catch (err) {
		console.log(`above error message`);
		console.log(err.response);
		console.log(err.message);
		if (err.response) {
			if (err.response.data) {
				if (err.response.data.length) {
					return res.status(401).json({ errors: [{ msg: 'No definition found!. Try something similar!', param: 'newWord' }] });
				}
			}
		}
		return res.status(401).json({ errors: [{ msg: 'Word submission failed!', param: 'newWord' }] });
	}
});

export default handler;
