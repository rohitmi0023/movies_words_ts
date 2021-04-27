import Head from 'next/head';
import SearchMovies from '../components/SearchMovies';
// import { Fab } from '@material-ui/core';
// import Link from 'next/link';
const Home = () => {
	return (
		<div>
			<Head>
				<title>Movies Words</title>
				<link href='https://fonts.googleapis.com/css?family=Montserrat:900|Work+Sans:300' rel='stylesheet' />
				<link
					href='https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,500;1,400&family=Sansita+Swashed:wght@700&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<SearchMovies />
		</div>
	);
};

export default Home;
