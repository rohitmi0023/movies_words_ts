import React, { Fragment } from 'react';
import styles from '../styles/BouncingBallLoader.module.css';
import purpleHUE from '@material-ui/core/colors/purple';
import indigoHue from '@material-ui/core/colors/indigo';

const BouncingBallLoader = ({ message, variant }) => {
	const variants = variant === 'purpleHUE' ? purpleHUE : indigoHue;
	return (
		<Fragment>
			<div className={styles.bouncer}>
				<div style={{ background: variants[200] }}></div>
				<div style={{ background: variants[400] }}></div>
				<div style={{ background: variants[600] }}></div>
				<div style={{ background: variants[900] }}></div>
			</div>
			<span>Loading {message}...</span>
		</Fragment>
	);
};

export default BouncingBallLoader;
