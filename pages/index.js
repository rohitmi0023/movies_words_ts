import { useEffect } from 'react';
import Head from 'next/head';
import SearchMovies from '../components/SearchMovies';
// import { Fab } from '@material-ui/core';
// import Link from 'next/link';
import { randomImagesAddition, randomNumberFunction } from '../store/actions/movieImagesAction';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavBar from '../components/NavBar';
import BouncingBallLoader from '../components/BouncingBallLoader';

const Home = ({ randomImagesAddition, randomNumberFunction, movieImagesLoading, movieImages, randomNumberState }) => {
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
		<div style={{ height: '100%' }}>
			<Head>
				<title>Movies Words</title>
				<link href='https://fonts.googleapis.com/css?family=Montserrat:900|Work+Sans:300' rel='stylesheet' />
				<link
					href='https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,500;1,400&family=Sansita+Swashed:wght@700&display=swap'
					rel='stylesheet'
				/>
			</Head>

			{!movieImagesLoading ? (
				<div className='imageWrapper'>
					<SearchMovies />
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

SearchMovies.propTypes = {
	randomImagesAddition: PropTypes.func,
	randomNumberFunction: PropTypes.func,
};

export default connect(mapStateToProps, { randomImagesAddition, randomNumberFunction })(Home);

{
	/* <Link href='/faqs'> */
}
{
	/* <Fab
					style={{ float: 'right', marginRight: '20px', backgroundColor: 'dimgrey' }}
					variant='extended'
				> */
}
{
	/* <a style={{ textDecoration: 'none', letterSpacing: '1.5px', color: 'white' }}>
					FAQs / Help
				</a> */
}
{
	/* </Fab> */
}
{
	/* </Link> */
}
