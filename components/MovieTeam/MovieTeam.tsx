import React, { useState, useEffect } from 'react';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { AppBar, Tab, makeStyles, Theme } from '@material-ui/core';
import MovieTeamCast from './MovieTeamCast';
import MovieTeamCrew from './MovieTeamCrew';
import MovieTeamProduction from './MovieTeamProduction';
import Axios from 'axios';
import { deepPurple } from '@material-ui/core/colors';
import BouncingBallLoader from '../BouncingBallLoader';

export interface iMovieTeam {
	id: Number | null;
	cast: Array<{
		adult: Boolean;
		gender: Number | null;
		id: Number;
		known_for_department: String;
		name: String;
		original_name: String;
		popularity: Number;
		profile_path: String | null;
		cast_id: Number;
		character: String;
		credit_id: String;
		order: Number;
	}> | null;
	crew: Array<{
		adult: Boolean;
		gender: Number | null;
		id: Number;
		known_for_department: String;
		name: String;
		original_name: String;
		popularity: Number;
		profile_path: String | null;
		credit_id: String;
		department: String;
		job: String;
	}> | null;
}

const useStyles = makeStyles((theme: Theme) => ({
	root: { flexGrow: 1, height: '100%' },
	padding: { padding: theme.spacing(3) },
	styled: props => ({
		backgroundColor: deepPurple[400],
	}),
}));

const MovieTeam = ({ movieDetailsState }) => {
	const props = { fontSize: '34px' };
	const classes = useStyles(props);
	const [tabValue, setTabValue] = useState('0');
	const [movieTeamState, setMovieTeamState] = useState<iMovieTeam | undefined>(undefined);
	const handleTabClick = () => {};

	useEffect(() => {
		let mounted = true;
		const movieTeamFunction = async () => {
			try {
				const movieId = window.location.pathname.replace('/movies/', '');
				const res = await Axios.get(
					`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=en-US`
				);
				if (mounted) {
					if (res.data.id && res.data.cast && res.data.crew) {
						setMovieTeamState(res.data);
					} else if (res.data && res.data.cast) {
						setMovieTeamState({
							id: res.data.id,
							cast: res.data.cast,
							crew: null,
						});
					} else if (res.data && res.data.crew) {
						setMovieTeamState({
							id: res.data.id,
							cast: null,
							crew: res.data.crew,
						});
					} else if (res.data.cast && res.data.crew) {
						setMovieTeamState({
							id: null,
							cast: res.data.cast,
							crew: res.data.crew,
						});
					} else {
						setMovieTeamState({
							id: res.data.id,
							cast: null,
							crew: null,
						});
					}
				}
			} catch (err) {
				console.log(err);
			}
		};
		movieTeamFunction();
		return () => (mounted = false);
	}, []);

	return (
		<div className={classes.root}>
			{movieTeamState && movieDetailsState ? (
				<TabContext value={tabValue}>
					<AppBar position='static' className={classes.styled}>
						<TabList onClick={handleTabClick} aria-label='simple tabs example'>
							<Tab label='Cast' value='0' onClick={() => setTabValue('0')} />
							<Tab label='Crew' value='1' onClick={() => setTabValue('1')} />
							<Tab label='Production' value='2' onClick={() => setTabValue('2')} />
						</TabList>
					</AppBar>
					<TabPanel value='0'>
						{movieTeamState.cast ? (
							<MovieTeamCast movieTeamCast={movieTeamState.cast} />
						) : (
							<p style={{ textAlign: 'center' }}>Nothing to show!</p>
						)}
					</TabPanel>
					<TabPanel value='1'>
						{movieTeamState.crew ? (
							<MovieTeamCrew movieTeamCrew={movieTeamState.crew} />
						) : (
							<p style={{ textAlign: 'center' }}>Nothing to show!</p>
						)}
					</TabPanel>
					<TabPanel value='2'>
						<MovieTeamProduction movieTeamProduction={movieDetailsState} />
					</TabPanel>
				</TabContext>
			) : (
				<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
					<BouncingBallLoader message='movie team details...' variant='indigoHUE' />
				</div>
			)}
		</div>
	);
};

export default MovieTeam;
