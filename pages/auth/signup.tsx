import React, { Fragment, useEffect } from 'react';
import SignUpForm from '../../components/SignupForm';
import NavBar from '../../components/NavBar';
import Link from 'next/link';
import { randomNumberFunction, randomImagesAddition } from '../../store/actions/movieImagesAction';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from '../../styles/signup.module.css';
import BouncingBallLoader from '../../components/BouncingBallLoader';

const signup = ({ randomNumberFunction, movieImages, randomNumberState, randomImagesAddition, movieImagesLoading }) => {
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
		<Fragment>
			<NavBar />
			{!movieImagesLoading ? (
				<div className='imageWrapper'>
					<div className='contentWrapper'>
						<div className={styles.cardCss}>
							<h2 style={{ padding: '10px 0 5px 0', fontWeight: 'bold' }}>Sign Up</h2>
							<span>
								Already an User?{' '}
								<Link href='/auth/login'>
									<a style={{ color: 'white' }}>Log In</a>
								</Link>
							</span>
							<br />
							<br />
							<SignUpForm />
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
		</Fragment>
	);
};

signup.propTypes = {
	randomNumberFunction: PropTypes.func,
	randomImagesAddition: PropTypes.func,
};

const mapStateToProps = state => {
	return {
		movieImages: state.images.randomImages,
		randomNumberState: state.images.randomNumberState,
		movieImagesLoading: state.images.loading,
	};
};

export default connect(mapStateToProps, { randomNumberFunction, randomImagesAddition })(signup);
