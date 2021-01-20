import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import { randomImagesAddition, randomNumberFunction } from '../store/actions/movieImagesAction';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BouncingBallLoader from '../components/BouncingBallLoader';
import { Typography } from '@material-ui/core';

const faqs = ({ randomImagesAddition, randomNumberFunction, movieImagesLoading, movieImages, randomNumberState }) => {
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
		<div>
			<NavBar />
			{!movieImagesLoading ? (
				<div className='imageWrapper'>
					<div style={{ position: 'absolute', marginTop: '15vh', color: 'white', zIndex: 1 }}>
						<Typography variant='h2' style={{ textAlign: 'center' }}>
							FAQs / Help
						</Typography>
						<div style={{ margin: '10px 40px' }}>
							<Typography variant='h4'>What this website is all about?</Typography>
							<Typography variant='h6' style={{ marginLeft: '20px' }}>
								Basically, it stores the words that are used in movies. Once you understand the words meaning and then watch the
								movie, that will help you in understanding how to use that word too.
							</Typography>
							<br />
							<Typography variant='h4'>How can I store words?</Typography>
							<Typography variant='h6' style={{ marginLeft: '20px' }}>
								So, there are <b>two</b> ways of doing it till now :-
								<br />
								<ol type='A'>
									<li>
										First one is manually adding the word. For example, if you discover <b>fugitive</b> word in the movie{' '}
										<b>Predestination</b>. Then,
										<ul>
											<li>
												Search for <b>Predestination</b> movie in the homepage.
											</li>
											<li>Click on the desired movie poster. You will be redirected to a new page.</li>
											<li>
												Add the word <b>fugitive</b> in the <i>add new word</i> input form.
											</li>
											<li>That's it, your word is saved.</li>
										</ul>
									</li>
									<li>
										Second one is by using the movie subtitles to extract few of the uncommon words.
										<ul>
											<li> The first two steps remains the same as above.</li>
											<li>Now you have to upload the movie subitle there.</li>
											<li>
												After successful upload, click on extract button and then we will suggest some of the words from it.
											</li>
											<li>You can add or remove the suggested words from list.</li>
										</ul>
									</li>
								</ol>
							</Typography>
							<br />
							<Typography variant='h4'>What makes this website different from a note app?</Typography>
							<Typography variant='h6' style={{ marginLeft: '20px' }}>
								There are few things that makes it more useful than notes app till now:-
								<ul>
									<li>The extracted words from the subtitle is a great feauture that is unique.</li>
									<li>
										You can see the words added by other people that makes your work much lesser i.e. you don't have to add all of
										them all by yourself.
									</li>
									<li>
										We will give you randomly the most popular words and other facts/information about words/movies in general.
									</li>
									<li>Your words are saved in our secured cloud database that will enusure that your data will not be lost.</li>
									<li>We will update/enhace this website regularly.</li>
								</ul>
							</Typography>
						</div>
					</div>
					{movieImages.length === 10 ? (
						<img src={`https://image.tmdb.org/t/p/original/${movieImages[randomNumberState].poster}`} alt='movieImages' />
					) : (
						<div style={{ background: 'dimgrey', height: '100vh', textAlign: 'center' }}>Failed to load image wallpaper</div>
					)}
				</div>
			) : (
				<div style={{ margin: '40vh 40vw 0 40vw' }}>
					<BouncingBallLoader message='image wallpaper' variant='purpleHUE' />
				</div>
			)}
		</div>
	);
};

const mapStateToProps = state => {
	return {
		movieImages: state.images.randomImages,
		movieImagesLoading: state.images.loading,
		randomNumberState: state.images.randomNumberState,
	};
};

faqs.propTypes = {
	randomImagesAddition: PropTypes.func,
	randomNumberFunction: PropTypes.func,
};

export default connect(mapStateToProps, { randomImagesAddition, randomNumberFunction })(faqs);
