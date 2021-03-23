import axios from 'axios';
import { useEffect, useState } from 'react';
// import Link from 'next/link';
import NavBar from '../../components/NavBar';
// import Fab from '@material-ui/core/Fab';
import { Paper, AppBar, Tab, makeStyles } from '@material-ui/core';
import { TabPanel, TabContext, TabList } from '@material-ui/lab';
var _ = require('lodash');
import styles from '../../styles/movieId.module.css';
import MovieDetails from '../../components/MovieDetails/MovieDetails';
import MovieTeam from '../../components/MovieTeam/MovieTeam';
import MovieReview from '../../components/MovieReview/MovieReview';
import BouncingBallLoader from '../../components/BouncingBallLoader';

export interface ImovieDetailsState {
	adult: Boolean;
	backdrop_path: String | null;
	belongs_to_collection: null | Object;
	budget: Number;
	genres: Array<{
		id: Number;
		name: String;
	}>;
	homepage: String | null;
	id: Number;
	imdb_id: String | null;
	original_language: String;
	original_title: String;
	overview: String | null;
	popularity: Number;
	poster_path: String | null;
	production_companies: Array<{
		name: String;
		id: Number;
		logo_path: String | null;
		origin_country: String;
	}>;

	production_countries: Array<{
		iso_3166_1: String;
		name: String;
	}>;
	release_date: String;
	revenue: Number;
	runtime: Number | null;

	spoken_languages: Array<{
		iso_639_1: String;
		name: String;
	}>;
	status: String;
	tagline: String | null;
	title: String;
	video: Boolean;
	vote_average: Number;
	vote_count: Number;
	videos: {
		results: Array<{
			id: String;
			iso_639_1: String;
			iso_3166_1: String;
			key: String;
			name: String;
			site: String;
			size: Number;
			type: String;
		}>;
	};
}

// const useStyles = makeStyles({
// 	root: {
// 		float: 'right',
// 		width: 'max-content',
// 		boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
// 		fontSize: '1rem',
// 		boxSizing: 'border-box',
// 		transition:
// 			'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
// 		textTransform: 'uppercase',
// 		margin: '3vh 5vw',
// 	},
// });

const Movies = () => {
	// const classes = useStyles();
	const [movieDetailsState, setMovieDetailsState] = useState<ImovieDetailsState | undefined>(undefined);
	const [tabValue, setTabValue] = useState('0');
	// const [movieImages, setMovieImages] = useState<ImovieImages | undefined>([]);// const [movieImagesLength, setMovieImagesLength] = useState(undefined);// const [randomNumber, setRandomNumber] = useState(undefined);// const [movieDetailsHeader, setMovieDetailsHeader] = useState<ImovieDetailsHeader | undefined>(undefined);// const [movieDetails, setMovieDetails] = useState<ImovieDetails | undefined>(undefined);

	useEffect(() => {
		const movieDetails = async () => {
			try {
				const movieId = window.location.pathname.replace('/movies/', '');
				const res = await axios.get(
					`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=en-US&append_to_response=videos,images&include_image_language=en,null`
				);
				setMovieDetailsState(res.data);
			} catch (err) {
				console.log(err);
				console.log(err.response);
			}
		};
		movieDetails();
	}, []);

	const handleTabClick = () => {};
	// let rating = currentMovie.Ratings// if (rating) {// 	rating = rating.map(each => {//return (//<span key={Math.random()}>//<b>{each.Source} : </b> {each.Value}//<br />//</span>//);//});// }

	return (
		<div>
			<NavBar color='#b388ff' />
			{movieDetailsState ? (
				<div className={styles.Wrapper}>
					{/* <Fab color='primary' className={classes.root}>
						Dictionary
					</Fab> */}
					<TabContext value={tabValue}>
						<AppBar position='static'>
							<TabList onClick={handleTabClick} aria-label='simple tabs example'>
								<Tab label='Details' value='0' onClick={() => setTabValue('0')} />
								<Tab label='Team' value='1' onClick={() => setTabValue('1')} />
								<Tab label='Reviews' value='2' onClick={() => setTabValue('2')} />
								<Tab label='Videos' disabled />
							</TabList>
						</AppBar>
						<TabPanel value='0'>
							<div>
								<MovieDetails movieDetailsState={movieDetailsState} />
							</div>
						</TabPanel>
						<TabPanel value='1'>
							<div>
								<MovieTeam movieDetailsState={movieDetailsState} />
							</div>
						</TabPanel>
						<TabPanel value='2'>
							<div>
								<MovieReview movieDetailsState={movieDetailsState} />
							</div>
						</TabPanel>
					</TabContext>
				</div>
			) : (
				<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
					<BouncingBallLoader message='movie details...' variant='purpleHUE' />
				</div>
			)}
		</div>
	);
};

export default Movies;
