import React, { Fragment } from 'react';
import styles from '../../styles/MovieTeamCrew.module.css';
import Switch from '@material-ui/core/Switch';
import BouncingBallLoader from '../BouncingBallLoader';

const MovieTeamCrew = ({ movieTeamCrew }) => {
	const [switchState, setSwitchState] = React.useState({
		directors: false,
		writors: false,
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSwitchState({ ...switchState, [event.target.name]: event.target.checked });
	};
	return (
		<div>
			{movieTeamCrew ? (
				<Fragment>
					<Fragment>
						<h4>
							Directors{' '}
							<Switch
								checked={switchState.directors}
								onChange={handleChange}
								name='directors'
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</h4>
						<div style={{ display: switchState.directors ? 'block' : 'none' }}>
							<div className={styles.crewWrapper}>
								{movieTeamCrew.map(each => {
									if (each.department === 'Directing') {
										return each.profile_path ? (
											<div key={each.credit_id} className={styles.eachCrew}>
												<img src={`https://image.tmdb.org/t/p/w500${each.profile_path}`} alt='profile image' />
												<div className={styles.eachName}>
													<b>{each.name}</b>
													<span>{each.character}</span>
												</div>
											</div>
										) : null;
									}
								})}
							</div>
						</div>
					</Fragment>
					<Fragment>
						<h4>
							Editing{' '}
							<Switch
								checked={switchState.writors}
								onChange={handleChange}
								name='writors'
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
						</h4>
						<div style={{ display: switchState.writors ? 'block' : 'none' }}>
							<div className={styles.crewWrapper}>
								{movieTeamCrew.map(each => {
									if (each.department === 'Writing') {
										return each.profile_path ? (
											<div key={each.credit_id} className={styles.eachCrew}>
												<img src={`https://image.tmdb.org/t/p/w500${each.profile_path}`} alt='profile image' />
												<div className={styles.eachName}>
													<b>{each.name}</b>
													<span>{each.character}</span>
												</div>
											</div>
										) : null;
									}
								})}
							</div>
						</div>
					</Fragment>
				</Fragment>
			) : (
				<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
					<BouncingBallLoader message='movie team crew details...' variant='indigoHUE' />
				</div>
			)}
		</div>
	);
};

export default MovieTeamCrew;
