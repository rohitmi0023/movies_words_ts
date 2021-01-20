import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styles from '../../styles/MovieDetails/MovieDetailsStats.module.css';
import BouncingBallLoader from '../BouncingBallLoader';
import { Paper } from '@material-ui/core';

export interface ImovieStats {
	budget: Number;
	popularity: Number;
	release_date: String;
	revenue: Number;
	runtime: Number | null;
	status: String;
	Country: String;
	BoxOffice: String;
	DVD: String;
	Rated: String;
}

const MovieStats = ({ movieStatsState }) => {
	const [movieStats, setMovieStats] = useState<ImovieStats | undefined>(undefined);

	useEffect(() => {
		let mounted = true;
		const movieStatsFunction = async () => {
			const { budget, popularity, release_date, revenue, runtime, status } = movieStatsState;
			try {
				if (mounted) {
					setMovieStats({
						budget,
						popularity,
						release_date,
						revenue,
						runtime,
						status,
						Country: 'Loading...',
						BoxOffice: 'Loading...',
						DVD: 'Loading...',
						Rated: 'Loading...',
					});
					const res = await Axios.get(
						`https://cors-anywhere.herokuapp.com/http://www.omdbapi.com/?i=${movieStatsState.imdb_id}&type=movie&apikey=${process.env.OMDB_KEY}`
					);
					if (res.data.Response === 'True') {
						const { Country, BoxOffice, DVD, Rated } = res.data;
						if (mounted) {
							setMovieStats({
								budget,
								popularity,
								release_date,
								revenue,
								runtime,
								status,
								Country,
								BoxOffice,
								DVD,
								Rated,
							});
						}
					} else {
						if (mounted) {
							setMovieStats({
								budget,
								popularity,
								release_date,
								revenue,
								runtime,
								status,
								Country: 'N/A',
								BoxOffice: 'N/A',
								DVD: 'N/A',
								Rated: 'N/A',
							});
						}
					}
				}
			} catch (err) {
				console.log(err.message);
				console.log(err.response);
				if (mounted) {
					setMovieStats({
						budget,
						popularity,
						release_date,
						revenue,
						runtime,
						status,
						Country: 'N/A',
						BoxOffice: 'N/A',
						DVD: 'N/A',
						Rated: 'N/A',
					});
				}
			}
		};
		if (mounted) {
			movieStatsFunction();
		}
		return () => (mounted = false);
	}, []);
	return (
		<div>
			{movieStats ? (
				<div className={styles.statsWrapper}>
					<Paper elevation={24} className={styles.eachStats}>
						<h3>Budget</h3>
						<p>$ {movieStats.budget === 0 ? 'N/A' : movieStats.budget}</p>
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h3>Status</h3>
						<p>{movieStats.status}</p>
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h3>Release Date</h3>
						<p>{movieStats.release_date}</p>
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h3>Runtime</h3>
						<p>{movieStats.runtime} mins</p>
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h3>Revenue</h3>
						<p>$ {movieStats.revenue}</p>
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h3>Country</h3>
						<p>{movieStats.Country}</p>
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h3>Box Office</h3>
						<p>{movieStats.BoxOffice}</p>
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h3>DVD</h3>
						<p>{movieStats.DVD}</p>
					</Paper>
					<Paper elevation={24} className={styles.eachStats}>
						<h3>Rated</h3>
						<p>{movieStats.Rated}</p>
					</Paper>
				</div>
			) : (
				<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
					<BouncingBallLoader message='movie details...' variant='indigoHUE' />
				</div>
			)}
		</div>
	);
};

export default MovieStats;
