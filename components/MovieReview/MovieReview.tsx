import React, { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { AppBar, Tab, makeStyles, Theme } from '@material-ui/core';
import MovieReviewRating from './MovieReviewRating';
import MovieReviewAuthors from './MovieReviewAuthors';
import { deepPurple } from '@material-ui/core/colors';
import BouncingBallLoader from '../BouncingBallLoader';

const useStyles = makeStyles((theme: Theme) => ({
	root: { flexGrow: 1 },
	padding: { padding: theme.spacing(3) },
	styled: props => ({
		backgroundColor: deepPurple[600],
	}),
}));

const MovieReview = ({ movieDetailsState }) => {
	const props = { fontSize: '24px' };
	const classes = useStyles(props);
	const [tabValue, setTabValue] = useState('0');
	const handleTabClick = () => {};
	return (
		<div className={classes.root}>
			{movieDetailsState ? (
				<TabContext value={tabValue}>
					<AppBar position='static' className={classes.styled}>
						<TabList onClick={handleTabClick} aria-label='simple tabs example'>
							<Tab label='Ratings' value='0' onClick={() => setTabValue('0')} />
							<Tab label='Authors' value='1' onClick={() => setTabValue('1')} />
						</TabList>
					</AppBar>
					<TabPanel value='0'>
						<MovieReviewRating movieDetailsState={movieDetailsState} />
					</TabPanel>
					<TabPanel value='1'>
						<MovieReviewAuthors />
					</TabPanel>
				</TabContext>
			) : (
				<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
					<BouncingBallLoader message='movie review...' variant='indigoHUE' />
				</div>
			)}
		</div>
	);
};

export default MovieReview;
