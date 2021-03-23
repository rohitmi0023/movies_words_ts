import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Paper } from '@material-ui/core';
import styles from '../../styles/MovieReviewRating.module.css';
import BouncingBallLoader from '../BouncingBallLoader';

const MovieReviewRating = ({ movieDetailsState }) => {
	const [omdbRating, setOmdbRating] = useState(undefined);
	useEffect(() => {
		let mounted = true;
		const movieReviewRatingFunction = async () => {
			try {
				const res = await Axios.get(`http://www.omdbapi.com/?i=${movieDetailsState.imdb_id}&type=movie&apikey=${process.env.OMDB_KEY}`);
				if (mounted) {
					setOmdbRating(res.data);
				}
			} catch (err) {
				console.log(err.message);
			}
		};
		movieReviewRatingFunction();
		return () => (mounted = false);
	}, []);
	return (
		<div>
			{movieDetailsState ? (
				<div className={styles.statsWrapper}>
					<Paper elevation={24} className={styles.eachStats}>
						<h4>Metascore</h4>
						{omdbRating ? omdbRating.Metascore ? <p>{omdbRating.Metascore}</p> : <p>'N/A'</p> : <p>Loading...</p>}
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h4>IMDB Rating</h4>
						{omdbRating ? omdbRating.imdbRating ? <p>{omdbRating.imdbRating}</p> : <p>'N/A'</p> : <p>Loading...</p>}
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h4>IMDB Votes</h4>
						{omdbRating ? omdbRating.imdbVotes ? <p>{omdbRating.imdbVotes}</p> : <p>'N/A'</p> : <p>Loading...</p>}
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h4>Awards</h4>
						{omdbRating ? omdbRating.Awards ? <p>{omdbRating.Awards}</p> : <p>'N/A'</p> : <p>Loading...</p>}
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h4>Popularity</h4>
						{movieDetailsState.popularity}
					</Paper>
					{omdbRating
						? omdbRating.Ratings.length
							? omdbRating.Ratings.map(each => (
									<Paper elevation={24} className={styles.eachStats} key={each.Source}>
										<h4>{each.Source}</h4>
										{each.Value}
									</Paper>
							  ))
							: null
						: null}
				</div>
			) : (
				<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
					<BouncingBallLoader message='movie review rating...' variant='indigoHUE' />
				</div>
			)}
		</div>
	);
};

export default MovieReviewRating;
