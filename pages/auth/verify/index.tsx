import React, { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavBar from '../../../components/NavBar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { randomNumberFunction, randomImagesAddition } from '../../../store/actions/movieImagesAction';

export const index = ({ register_state, loading, randomNumberFunction, movieImages, randomNumberState, randomImagesAddition }) => {
	const router = useRouter();
	useEffect(() => {
		if (!register_state) {
			router.push('/auth/signup');
		}
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
		<div style={{ position: 'relative', width: '100%' }}>
			{movieImages.length ? (
				<div
					className='imageWrapper'
					style={{
						backgroundImage:
							movieImages.length === 10
								? 'url(' + `https://image.tmdb.org/t/p/original/${movieImages[randomNumberState].poster}` + ')'
								: 'dimgrey',
						backgroundSize: movieImages.length === 10 ? 'cover' : 'unset',
						width: '100%',
						minHeight: '100vh',
					}}
				>
					{loading ? (
						<div
							style={{
								textAlign: 'center',
								position: 'absolute',
								margin: '20vh 50vw',
								zIndex: 1,
							}}
						>
							<CircularProgress />
						</div>
					) : register_state ? (
						<div>
							<NavBar />
							<div style={{ position: 'absolute', zIndex: 2 }}>
								<br />
								<br />
								<h2 style={{ textAlign: 'center', color: 'white' }}>Thanks for signing up!</h2>
								<h6 style={{ margin: '10px 25px', color: 'white' }}>
									An email has been sent to your given gmail account. Please go to the email to complete your sign up process.
								</h6>
							</div>
						</div>
					) : (
						<h3
							style={{
								position: 'absolute',
								zIndex: 1,
								textAlign: 'center',
								color: 'white',
							}}
						>
							You have not registered yet!
						</h3>
					)}
				</div>
			) : (
				<div>
					<CircularProgress />
				</div>
			)}
		</div>
	);
};

index.propTypes = {
	randomNumberFunction: PropTypes.func,
	randomImagesAddition: PropTypes.func,
};

const mapStateToProps = state => {
	return {
		register_state: state.auth.register_state,
		loading: state.auth.loading,
		movieImages: state.images.randomImages,
		randomNumberState: state.images.randomNumberState,
	};
};

export default connect(mapStateToProps, { randomNumberFunction, randomImagesAddition })(index);
