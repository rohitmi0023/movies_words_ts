import React, { Fragment, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import Link from 'next/link';
import LoginForm from '../../components/LoginForm';
// import LoginSocial from '../../components/LoginSocial';
import { randomNumberFunction, randomImagesAddition } from '../../store/actions/movieImagesAction';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from '../../styles/login.module.css';
import BouncingBallLoader from '../../components/BouncingBallLoader';

const login = ({ randomNumberFunction, movieImages, randomNumberState, randomImagesAddition, movieImagesLoading }) => {
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
						minHeight: '100vh',
					}}
				>
					<NavBar />
					<div style={{ zIndex: 1, opacity: 1, position: 'relative', color: 'white', marginTop: '15vh' }}>
						<div className={styles.cardCss}>
							<div className='container'>
								<h2 style={{ padding: '10px 0 5px 0', fontWeight: 'bold' }}>Sign In</h2>
								<span>
									New here?{'  '}
									<Link href='/auth/signup'>
										<a style={{ color: 'white' }}>Sign Up</a>
									</Link>
								</span>
								<br />
								<br />
								<LoginForm />
								{/* <LoginSocial/> */}
							</div>
						</div>
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

login.propTypes = {
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

export default connect(mapStateToProps, { randomNumberFunction, randomImagesAddition })(login);
