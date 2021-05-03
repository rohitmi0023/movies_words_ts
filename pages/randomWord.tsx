import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import RandomWord from '../components/RandomWord';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BouncingBallLoader from '../components/BouncingBallLoader';
import { randomNumberFunction, randomImagesAddition } from '../store/actions/movieImagesAction';

const randomWord = ({ movieImages, randomNumberFunction, movieImagesLoading, randomImagesAddition, randomNumberState }) => {
	useEffect(() => {
		const MovieFetching = async () => {
			try {
				randomImagesAddition();
				randomNumberFunction();
			} catch (err) {
				console.log(err);
			}
		};
		MovieFetching();
	}, []);

	return (
		<div style={{ position: 'relative' }}>
			<NavBar />
			{!movieImagesLoading ? (
				<div
					className='imageWrapper'
					style={{
						backgroundImage:
							movieImages.length === 10
								? 'url(' + `https://image.tmdb.org/t/p/original/${movieImages[randomNumberState].poster}` + ')'
								: 'dimgrey',
						backgroundSize: movieImages.length === 10 ? 'cover' : 'unset',
						backgroundAttachment: movieImages.length === 10 ? 'fixed' : 'unset',
						width: '100%',
					}}
				>
					<div style={{ zIndex: 1, opacity: 1, position: 'relative', color: 'white', marginTop: '15vh' }}>
						<RandomWord />
					</div>
				</div>
			) : (
				<div style={{ margin: '40vh 40vw 0 40vw' }}>
					<BouncingBallLoader message='image wallpaper' variant='indigoHUE' />
				</div>
			)}
		</div>
	);
};

randomWord.propTypes = {
	randomNumberFunction: PropTypes.func,
};

const mapStateToProps = state => {
	return {
		movieImages: state.images.randomImages,
		randomNumberState: state.images.randomNumberState,
		movieImagesLoading: state.images.loading,
	};
};

export default connect(mapStateToProps, { randomNumberFunction, randomImagesAddition })(randomWord);
