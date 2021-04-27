// displaying home page from navbar, faqs, random word to search bar
import React, { useState, Fragment, useEffect } from 'react';
import axios from 'axios';
import SearchResult from './SearchResult';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import RandomWord from './RandomWord';
import styles from '../styles/SearchMovies.module.css';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { deepPurple, indigo } from '@material-ui/core/colors';
import BouncingBallLoader from './BouncingBallLoader';
import NavBar from './NavBar';
import Link from 'next/link';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { randomImagesAddition, randomNumberFunction } from '../store/actions/movieImagesAction';

let cancelToken;
const useStyles = makeStyles({
	root: {
		opacity: 0.8,
		textTransform: 'none',
		padding: '6px 12px',
		border: '2px solid',
		background: 'linear-gradient(90deg, rgba(49,55,140,1) 52%, rgba(213,103,210,1) 100%)',
		borderColor: deepPurple[400],
		boxShadow: '0 0 0 0.2rem rgba(29, 43, 117,5)',
		'&:hover': {
			borderColor: indigo[900],
			background: 'linear-gradient(270deg, rgba(49,55,140,1) 52%, rgba(213,103,210,1) 100%)',
			boxShadow: '0 0 0 0.2rem rgba(130, 36, 143,5)',
		},
	},
});

const SearchMovies = ({ randomImagesAddition, randomNumberFunction, movieImagesLoading, movieImages, randomNumberState }) => {
	const classes = useStyles();

	// React local states
	const [searchFormData, setSearchFormData] = useState('');
	const [searchResultState, setSearchResultState] = useState({
		Response: null,
		Error: null,
		Search: [],
		loading: true,
	})!;

	// uses local state to show results on every keystroke
	const handleChange = async e => {
		setSearchResultState({
			...searchResultState,
			Response: false,
			Search: [],
			Error: null,
			loading: true,
		});
		setSearchFormData(e.target.value);
		let urlForSearch;
		urlForSearch = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=en-US&query=${e.target.value}&page=1&include_adult=false`;
		if (e.target.value) {
			try {
				if (typeof cancelToken !== typeof undefined) {
					cancelToken.cancel(`Previous search result cancelled!`);
				}
				cancelToken = axios.CancelToken.source();
				const res2 = await axios.get(urlForSearch, { cancelToken: cancelToken.token });
				if (res2.data.results.length) {
					setSearchResultState({
						...searchResultState,
						Response: true,
						Search: res2.data.results.slice(0, 10),
						Error: null,
						loading: false,
					});
				} else {
					setSearchResultState({
						...searchResultState,
						Response: false,
						Error: 'Nothing matched!',
						Search: null,
						loading: false,
					});
				}
			} catch (err) {
				setSearchResultState({
					...searchResultState,
					Response: false,
					Search: [],
					Error: 'Failed to load!',
					loading: false,
				});
			}
		}
	};

	// uses local state to show results on clicking submit button
	const handleSubmit = async e => {
		e.preventDefault();
		setSearchResultState({
			...searchResultState,
			Response: false,
			Search: [],
			Error: null,
			loading: true,
		});
		if (searchFormData.length) {
			const urlForTitle = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=en-US&query=${searchFormData}&page=1&include_adult=false`;
			const res = await axios.get(urlForTitle);
			try {
				if (res.data.results.length) {
					setSearchResultState({
						...searchResultState,
						Response: true,
						Search: res.data.results.slice(0, 10),
						Error: null,
					});
				} else {
					setSearchResultState({
						...searchResultState,
						Response: false,
						Error: 'Nothing matched!',
						Search: null,
					});
				}
			} catch (err) {
				setSearchResultState({
					...searchResultState,
					Response: false,
					Search: [],
					Error: 'Failed to load!',
					loading: false,
				});
			}
		}
	};

	useEffect(() => {
		const MovieFetching = async () => {
			try {
				randomNumberFunction();
				randomImagesAddition();
			} catch (err) {
				console.log(err);
			}
		};
		MovieFetching();
	}, []);

	return (
		<Fragment>
			<div style={{ position: 'relative' }}>
				{!movieImagesLoading ? (
					<div
						className='imageWrapper'
						style={{
							backgroundImage:
								movieImages.length === 10
									? window.origin === 's'
										? 'url(' + `https://image.tmdb.org/t/p/original/${movieImages[randomNumberState].poster}` + ')'
										: 'url(' + `http://image.tmdb.org/t/p/original/${movieImages[randomNumberState].poster}` + ')'
									: 'dimgrey',
							backgroundSize: movieImages.length === 10 ? 'cover' : 'unset',
							backgroundAttachment: movieImages.length === 10 ? 'fixed' : 'unset',
							width: '100%',
						}}
					>
						<NavBar />
						<div
							className={styles.gridWrapper}
							style={{ zIndex: 1, opacity: 1, position: 'relative', color: 'white', marginTop: '15vh' }}
						>
							<div className={styles.faqsWrapper}>
								<Link href='/faqs'>
									<a>
										<Card variant='outlined' className={classes.root}>
											<CardContent>
												<Typography variant='h5' style={{ color: 'white' }}>
													First time here? Click here to know us.
												</Typography>
											</CardContent>
										</Card>
									</a>
								</Link>
							</div>
							<div className={styles.randomWordWrapper}>
								<Link href='/randomWord'>
									<a>
										<Card variant='outlined' className={classes.root}>
											<CardContent>
												<Typography variant='h5' style={{ color: 'white' }}>
													Discover new word.
												</Typography>
											</CardContent>
										</Card>
									</a>
								</Link>
							</div>
							<div className={styles.searchFormWrapper}>
								<form onSubmit={e => handleSubmit(e)} className={styles.searchForm}>
									<div className={styles.form}>
										<TextField
											label='Enter the movie name'
											variant='filled'
											type='text'
											onChange={e => handleChange(e)}
											value={searchFormData}
											className='MuiFilledInput-input MuiInputBase-input MuiInputLabel-root search-text-field'
										/>
									</div>
									<div className='form'>
										<Button
											variant='contained'
											color='primary'
											onClick={e => handleSubmit(e)}
											className={clsx('search-button', classes.root)}
										>
											Submit
										</Button>
									</div>
								</form>
								{searchFormData ? (
									!searchResultState.loading ? (
										searchResultState.Response === true ? (
											<SearchResult searchresult={searchResultState} />
										) : (
											searchResultState.Response === false && (
												<p className={styles.resultsTextHome}>{searchResultState.Error}</p>
											)
										)
									) : (
										<div style={{ margin: '10vh 0 0 5vw' }} className={styles.resultsTextHome}>
											<BouncingBallLoader message='results...' variant='indigoHUE' />
										</div>
									)
								) : (
									<p className={styles.resultsTextHome}>Nothing Searched!!!</p>
								)}
							</div>
						</div>
					</div>
				) : (
					<div style={{ margin: '40vh 40vw 0 40vw' }}>
						<BouncingBallLoader message='image wallpaper' variant='purpleHUE' />
					</div>
				)}
			</div>
		</Fragment>
	);
};

const mapStateToProps = state => {
	return {
		movieImages: state.images.randomImages,
		movieImagesLoading: state.images.loading,
		randomNumberState: state.images.randomNumberState,
	};
};

SearchMovies.propTypes = {
	randomImagesAddition: PropTypes.func,
	randomNumberFunction: PropTypes.func,
};

export default connect(mapStateToProps, { randomImagesAddition, randomNumberFunction })(SearchMovies);
