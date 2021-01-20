import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { CircularProgress, Typography } from '@material-ui/core';
import styles from '../../styles/MovieReviewAuthors.module.css';
import BouncingBallLoader from '../BouncingBallLoader';

export interface IAuthorReviewState {
	id: Number;
	page: Number;
	total_pages: Number;
	total_results: Number;
	results: Array<{
		author: String;
		content: String;
		created_at: String;
		id: string;
		updated_at: String;
		url: string;
		author_details: {
			name: String;
			username: String;
			avatar_path: string | null;
			rating: Number | null;
		};
	}>;
}

const MovieReviewAuthors = () => {
	const [authorReviewState, setAuthorReviewState] = useState<IAuthorReviewState | undefined>(undefined);
	useEffect(() => {
		let mounted = true;
		const movieId = window.location.pathname.replace('/movies/', '');
		Axios.get(
			`https://cors-anywhere.herokuapp.com/https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=en-US&page=1`
		)
			.then(res => {
				console.log(res);
				if (mounted) {
					setAuthorReviewState(res.data);
				}
			})
			.catch(err => {
				console.log(err.message);
			});
		return () => {
			mounted = false;
		};
	}, []);
	return (
		<div>
			{authorReviewState ? (
				<div className={styles.authorsWrapper}>
					{authorReviewState.results.length ? (
						authorReviewState.results.map(each =>
							each.author_details.avatar_path ? (
								<div key={each.id} className={styles.eachAuthors}>
									<a href={each.url} target='_blank'>
										<img src={`https://image.tmdb.org/t/p/original${each.author_details.avatar_path}`} alt='author profile' />
										<p>{each.author_details.name ? each.author_details.name : 'N/A'}</p>
									</a>
								</div>
							) : null
						)
					) : (
						<Typography variant='h4'>Nothing to show!</Typography>
					)}
				</div>
			) : (
				<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
					<BouncingBallLoader message='movie review authors...' variant='indigoHUE' />
				</div>
			)}
		</div>
	);
};

export default MovieReviewAuthors;
