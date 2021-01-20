import React, { useState } from 'react';
import styles from '../styles/movieDetails.module.css';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { AppBar, Tab, makeStyles, Theme, withStyles, rgbToHex } from '@material-ui/core';
import MovieGeneral from './MovieDetailsGeneral';
import MovieStats from './MovieDetailsStats';
import MovieWatchProviders from './MovieDetailsWatchProviders';
import { deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) => ({
	root: { flexGrow: 1 },
	padding: { padding: theme.spacing(3) },
	styled: props => ({
		backgroundColor: deepPurple[800],
	}),
}));

const MovieDetails = ({ movieDetailsState }) => {
	const props = { fontSize: '34px' };
	const classes = useStyles(props);
	const [tabValue, setTabValue] = useState('0');
	const handleTabClick = () => {};
	return (
		<div className={classes.root}>
			<TabContext value={tabValue}>
				<AppBar position='static' className={classes.styled}>
					<TabList onClick={handleTabClick} aria-label='simple tabs example'>
						<Tab label='General' value='0' onClick={() => setTabValue('0')} />
						<Tab label='Stats' value='1' onClick={() => setTabValue('1')} />
						<Tab label='Watch Providers' value='2' onClick={() => setTabValue('2')} />
					</TabList>
				</AppBar>
				<TabPanel value='0'>
					<MovieGeneral movieGeneralState={movieDetailsState} />
				</TabPanel>
				<TabPanel value='1'>
					<MovieStats movieStatsState={movieDetailsState} />
				</TabPanel>
				<TabPanel value='2'>
					<MovieWatchProviders />
				</TabPanel>
			</TabContext>
		</div>
	);
};

export default MovieDetails;
