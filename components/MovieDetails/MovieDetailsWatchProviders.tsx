import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import styles from '../../styles/MovieDetails/MovieDetailsWatchProviders.module.css';
import { Paper } from '@material-ui/core';
import BouncingBallLoader from '../BouncingBallLoader';

export interface iMovieWatchProviders {
	link: string | null;
	buy: Array<{
		display_priority: Number;
		logo_path: String;
		provider_id: number;
		provider_name: String;
	}> | null;
	flatrate: Array<{
		display_priority: Number;
		logo_path: String;
		provider_id: number;
		provider_name: String;
	}> | null;
	rent: Array<{
		display_priority: Number;
		logo_path: String;
		provider_id: number;
		provider_name: String;
	}> | null;
}

const MovieWatchProviders = () => {
	const [movieWatchProviders, setMovieWatchProviders] = useState<iMovieWatchProviders | undefined>(undefined);
	useEffect(() => {
		let mounted = true;
		const MovieWatchProvidersFunction = async () => {
			try {
				const movieId = window.location.pathname.replace('/movies/', '');
				const resWatchProvider = await Axios.get(
					`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`
				);
				if (resWatchProvider.data.results) {
					if (resWatchProvider.data.results.IN) {
						const { link, buy, flatrate, rent } = resWatchProvider.data.results.IN;
						if (mounted) {
							setMovieWatchProviders({
								link,
								buy,
								flatrate,
								rent,
							});
						}
					} else {
						if (mounted) {
							setMovieWatchProviders({
								link: null,
								buy: null,
								flatrate: null,
								rent: null,
							});
						}
					}
				} else {
					if (mounted) {
						setMovieWatchProviders({
							link: null,
							buy: null,
							flatrate: null,
							rent: null,
						});
					}
				}
			} catch (err) {
				console.log(err);
				if (mounted) {
					setMovieWatchProviders({
						link: null,
						buy: null,
						flatrate: null,
						rent: null,
					});
				}
			}
		};
		MovieWatchProvidersFunction();
		return () => (mounted = false);
	}, []);

	return (
		<Fragment>
			{movieWatchProviders ? (
				<div className={styles.watchProvider}>
					<h2 style={{ textAlign: 'center' }}>
						<a href={movieWatchProviders.link} style={{ textDecoration: 'none' }} target='_blank'>
							Where to watch? (India)
						</a>
					</h2>
					<br />
					<div className={styles.watchWrapper}>
						<Paper elevation={24} className={styles.eachWatch}>
							<h3>Buy</h3>
							<div className={styles.Provider}>
								{movieWatchProviders.buy ? (
									movieWatchProviders.buy.map(each => (
										<div key={each.provider_id} className={styles.eachProvider}>
											<img src={`https://image.tmdb.org/t/p/original/${each.logo_path}`} alt='logo' />
											<span style={{ textAlign: 'center' }}>{each.provider_name}</span>
										</div>
									))
								) : (
									<h5 style={{ textAlign: 'center' }}>Nothing to show!</h5>
								)}
							</div>
						</Paper>
						<Paper elevation={24} className={styles.eachWatch}>
							<h3>Rent</h3>
							<div className={styles.Provider}>
								{movieWatchProviders.rent ? (
									movieWatchProviders.rent.map(each => (
										<div key={each.provider_id} className={styles.eachProvider}>
											<img src={`https://image.tmdb.org/t/p/original/${each.logo_path}`} alt='logo' />
											<span style={{ textAlign: 'center' }}>{each.provider_name}</span>
										</div>
									))
								) : (
									<h5 style={{ textAlign: 'center' }}>Nothing to show!</h5>
								)}
							</div>
						</Paper>
						<Paper elevation={24} className={styles.eachWatch}>
							<h3>Stream</h3>
							<div className={styles.Provider}>
								{movieWatchProviders.flatrate ? (
									movieWatchProviders.flatrate.map(each => (
										<div className={styles.eachProvider} key={each.provider_id}>
											<img src={`https://image.tmdb.org/t/p/original/${each.logo_path}`} alt='logo' />
											<span style={{ textAlign: 'center' }}>{each.provider_name}</span>
										</div>
									))
								) : (
									<h5 style={{ textAlign: 'center' }}>Nothing to show!</h5>
								)}
							</div>
						</Paper>
					</div>
				</div>
			) : (
				<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
					<BouncingBallLoader message='movie details...' variant='indigoHUE' />
				</div>
			)}
		</Fragment>
	);
};

export default MovieWatchProviders;
