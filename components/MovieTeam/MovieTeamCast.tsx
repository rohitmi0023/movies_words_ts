import React from 'react';
import styles from '../../styles/MovieTeamCast.module.css';
import BouncingBallLoader from '../BouncingBallLoader';

const MovieTeamCast = ({ movieTeamCast }) => {
	return (
		<div>
			{movieTeamCast ? (
				<div className={styles.castWrapper}>
					{movieTeamCast.map((each, index) => {
						if (index > 10) {
							return null;
						} else {
							return each.profile_path ? (
								<div key={each.cast_id} className={styles.eachCast}>
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
			) : (
				<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
					<BouncingBallLoader message='movie team cast details...' variant='indigoHUE' />
				</div>
			)}
		</div>
	);
};

export default MovieTeamCast;
