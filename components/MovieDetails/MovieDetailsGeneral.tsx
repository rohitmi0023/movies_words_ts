import React, { useEffect, useState } from 'react';
import styles from '../../styles/MovieDetails/MovieDetailsGeneral.module.css';
import Link from 'next/link';
import BouncingBallLoader from '../BouncingBallLoader';

export interface ImovieGeneral {
	poster_path: String | null;
	tagline: String | null;
	title: String;
	homepage: string | null;
	original_title: String;
	overview: String | null;
	spoken_languages: String;
	original_language: String;
}

const MovieGeneral = ({ movieGeneralState }) => {
	const [movieGeneral, setMovieGeneral] = useState<ImovieGeneral | undefined>(undefined);
	useEffect(() => {
		const { poster_path, tagline, title, homepage, original_title, overview, spoken_languages, original_language } = movieGeneralState;
		const spokenLanguages = spoken_languages
			.map(each => {
				return each['name'];
			})
			.toString();
		setMovieGeneral({
			poster_path,
			tagline,
			title,
			original_language,
			original_title,
			overview,
			homepage,
			spoken_languages: spokenLanguages,
		});
	}, []);
	return (
		<div>
			{movieGeneral ? (
				<div className={styles.wrapper}>
					<div className={styles.image}>
						<img src={`https://image.tmdb.org/t/p/w500/${movieGeneral.poster_path}`} alt='movie poster' />
					</div>
					<div className={styles.overview}>
						{movieGeneral.homepage ? (
							<Link href={movieGeneral.homepage ? movieGeneral.homepage : ''}>
								<a target='_blank'>
									{movieGeneral.original_title === movieGeneral.title ? (
										<span>{movieGeneral.title}</span>
									) : (
										<span>
											{movieGeneral.original_title}. ({movieGeneral.title})
										</span>
									)}
								</a>
							</Link>
						) : movieGeneral.original_title === movieGeneral.title ? (
							<span>{movieGeneral.title}</span>
						) : (
							<span>
								{movieGeneral.original_title}. ({movieGeneral.title})
							</span>
						)}

						{movieGeneral.tagline ? <p>" {movieGeneral.tagline} "</p> : null}
						<h3>Overview</h3>
						{movieGeneral.overview ? movieGeneral.overview : <p>We are sorry! Nothing found!</p>}
						<h5>Spoken Language(s)</h5>
						<p>{movieGeneral.spoken_languages}</p>
						<h5>Original Language(s)</h5>
						<p>{movieGeneral.original_language}</p>
					</div>
				</div>
			) : (
				<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
					<BouncingBallLoader message='movie details...' variant='indigoHUE' />
				</div>
			)}
		</div>
	);
};

export default MovieGeneral;
