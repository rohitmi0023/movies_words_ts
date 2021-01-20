import React from 'react';
import styles from '../../styles/MovieTeamProduction.module.css';
import BouncingBallLoader from '../BouncingBallLoader';

const MovieTeamProduction = ({ movieTeamProduction }) => {
	return movieTeamProduction ? (
		<div>
			<h3>Production Company(s)</h3>
			{movieTeamProduction.production_companies.length ? (
				<div className={styles.productionWrapper}>
					{movieTeamProduction.production_companies.map(each => (
						<div key={each.id} className={styles.eachProduction}>
							<img src={`https://image.tmdb.org/t/p/original${each.logo_path}`} alt='logo image' />
							<h4>{each.name}</h4>
						</div>
					))}
				</div>
			) : (
				<p>Nothing to show!</p>
			)}
			<br />
			<h3>Production Country(s)</h3>
			{movieTeamProduction.production_countries.length ? (
				<div className={styles.productionWrapper}>
					{movieTeamProduction.production_countries.map(each => (
						<div key={each.name} className={styles.eachProduction}>
							<h5>{each.name}</h5>
							<q>{each.iso_3166_1}</q>
						</div>
					))}
				</div>
			) : (
				<p>Nothing to show!</p>
			)}
		</div>
	) : (
		<div style={{ textAlign: 'center', margin: '20vh 40vw' }}>
			<BouncingBallLoader message='movie team production details...' variant='indigoHUE' />
		</div>
	);
};

export default MovieTeamProduction;
