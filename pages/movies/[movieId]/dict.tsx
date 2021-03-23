import React, { useState, useEffect, Fragment } from 'react';
import Head from 'next/head';
import Axios from 'axios';
import WordResults from '../../../components/WordResults';
import NavBar from '../../../components/NavBar';
import { Container, Button, TextField, Typography } from '@material-ui/core';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadWords, newWord, userVoting } from '../../../store/actions/wordsAction';
import { loadUser } from '../../../store/actions/authAction';
import { currentMoviePoster } from '../../../store/actions/movieImagesAction';
import styles from '../../../styles/dict.module.css';
import SubtitleFileUpload from '../../../components/SubtitleFileUpload';
import AlertBar from '../../../components/AlertBar';
import BouncingBallLoader from '../../../components/BouncingBallLoader';

interface IcurrentMovie {
	movieId: Number;
	adult: Boolean;
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
	video: Boolean;
	vote_average: Number;
	vote_count: Number;
}

const dictionary = ({ loadWords, wordFail, user, userVoting, loadingWords, newWord, currentMoviePoster, currentMovieImage, movieImagesLoading }) => {
	const [currentMovie, setCurrentMovie] = useState<IcurrentMovie | undefined>(undefined);
	const [searchWord, setSearchWord] = useState('');
	const handleChange = async e => {
		setSearchWord(e.target.value);
	};

	// submitting a word
	const handleSubmit = async e => {
		e.preventDefault();
		const userId = user ? user.id : null;
		newWord({
			currentMovie,
			userId,
			word: searchWord,
		});
		setSearchWord('');
	};

	useEffect(() => {
		const MovieDetails = async () => {
			try {
				let movieIdQuery = window.location.pathname.replace('/movies/', '').replace('/dict', '');
				const res = await Axios.get(
					`https://api.themoviedb.org/3/movie/${movieIdQuery}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=en-US`
				);
				const {
					id,
					adult,
					homepage,
					title,
					original_title,
					original_language,
					popularity,
					release_date,
					imdb_id,
					genres,
					poster_path,
					production_countries,
					runtime,
					status,
					tagline,
					video,
					vote_average,
					vote_count,
				} = res.data;
				const movieId = id;
				currentMoviePoster(poster_path);
				const genreString = genres
					.map(item => {
						return item['name'];
					})
					.toString();
				const productionCountriesString = production_countries
					.map(item => {
						return item['name'];
					})
					.toString();
				setCurrentMovie({
					movieId: id,
					adult,
					homepage,
					title,
					original_title,
					original_language,
					popularity,
					released_date: release_date,
					imdb_id,
					genre: genreString,
					poster_path,
					production_countries: productionCountriesString,
					runtime,
					status,
					tagline,
					video,
					vote_average,
					vote_count,
				});
				// Fetching all the words on the initial render of the page
				loadWords({ movieId });
				// Fetching all the votes done by the user, if he is logged in
				if (Boolean(user)) {
					userVoting({ user, movieId });
				}
			} catch (err) {
				console.log(err);
			}
		};
		MovieDetails();
	}, []);

	return (
		<div style={{ position: 'relative' }}>
			{!movieImagesLoading ? (
				<div
					className='imageWrapper'
					style={{
						backgroundImage: currentMovieImage ? 'url(' + `${currentMovieImage}` + ')' : 'dimgrey',
						backgroundSize: currentMovieImage ? 'cover' : 'unset',
						backgroundAttachment: currentMovieImage ? 'fixed' : 'unset',
						width: '100%',
						minHeight: '100vh',
					}}
				>
					<NavBar />
					<div style={{ zIndex: 1, opacity: 1, position: 'relative', color: 'white', marginTop: '15vh' }}>
						{currentMovie ? (
							<Fragment>
								{currentMovie.title && currentMovie.original_title ? (
									<Typography variant='h3' className='titleHeading'>
										<Link href='/movies/[movieId]' as={`/movies/${currentMovie.movieId}/`}>
											<a className='titleAnchor'>{currentMovie.original_title}</a>
										</Link>
									</Typography>
								) : (
									<div style={{ textAlign: 'center', margin: '20px 0px' }}>
										<BouncingBallLoader message='movie title details...' variant='indigoHUE' />
									</div>
								)}
								<div className={styles.wrapper}>
									<SubtitleFileUpload user={user} currentMovie={currentMovie} />
									{wordFail.length ? (
										wordFail[0].alertType === 'newWord' ? (
											<AlertBar message={wordFail[0].msg} type='error' />
										) : null
									) : null}
									{currentMovie.title && !loadingWords ? (
										<form onSubmit={e => handleSubmit(e)} className={styles.searchForm}>
											<div className={styles.form}>
												<TextField
													className='MuiFilledInput-input MuiInputBase-input MuiInputLabel-root search-text-field'
													variant='filled'
													color='primary'
													value={searchWord}
													label='Add a word'
													onChange={e => handleChange(e)}
												></TextField>
											</div>
											<div className={styles.form}>
												<Button variant='contained' color='primary' onClick={e => handleSubmit(e)} className='search-button'>
													Submit
												</Button>
											</div>
											<br />
										</form>
									) : null}
									<WordResults movieId={currentMovie.movieId} />
								</div>
							</Fragment>
						) : (
							<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
								<BouncingBallLoader message='movie details...' variant='indigoHUE' />
							</div>
						)}
					</div>
				</div>
			) : (
				<div style={{ margin: '40vh 40vw 0 40vw' }}>
					<BouncingBallLoader message='image wallpaper' variant='purpleHUE' />
				</div>
			)}
		</div>
	);
};

dictionary.propTypes = {
	currentMoviePoster: PropTypes.func,
	loadWords: PropTypes.func.isRequired,
	newWord: PropTypes.func.isRequired,
	loadUser: PropTypes.func,
};

const mapStateToProps = state => {
	return {
		user: state.auth.user,
		totalWords: state.words.totalWords,
		wordFail: state.alert,
		loadingWords: state.words.loadingWords,
		currentMovieImage: state.images.currentMovieImage,
		movieImagesLoading: state.images.loading,
	};
};

export default connect(mapStateToProps, {
	loadWords,
	newWord,
	userVoting,
	loadUser,
	currentMoviePoster,
})(dictionary);
