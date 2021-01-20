import React, { useRef, useState, useEffect, Fragment } from 'react';
import { Typography, Button, Grid, Paper, Chip, CircularProgress } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/SubtitleFileUpload.module.css';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { newWord } from '../store/actions/wordsAction';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import AlertBar from './AlertBar';
import { addSubtitle, extractSubtitleAction, changeLimit, changeCurrent10 } from '../store/actions/subtitleAction';

const SubtitleFileUpload = ({
	user,
	currentMovie,
	newWord,
	addSubtitle,
	subtitle,
	extractSubtitleAction,
	changeLimit,
	changeCurrent10,
	wordFail,
}) => {
	const fileInput = useRef<HTMLInputElement>(null);
	const [extractSubtitleLoading, setExtractSubtitleLoading] = useState(false);

	const uploadSubtitle = async e => {
		e.preventDefault();
		addSubtitle({ user, fileInput, currentMovie });
	};

	const extractSubtitleFunction = async () => {
		setExtractSubtitleLoading(true);
		await extractSubtitleAction({ currentMovie, user });
		setExtractSubtitleLoading(false);
	};

	const addWord = async (e, each) => {
		const userId = user ? user.id : null;
		const resp = await newWord({
			currentMovie,
			userId,
			word: each,
		});
		if (resp) {
			changeCurrent10({ subtitle, each });
		}
	};

	const deleteWord = async (e, each) => {
		if (user) {
			changeCurrent10({ subtitle, each });
		} else {
			console.log(`Please login to delete`);
		}
	};

	const nextButton = async e => {
		changeLimit(+10);
	};

	const prevButton = async e => {
		changeLimit(-10);
	};

	return (
		<Fragment>
			{wordFail.length ? (
				wordFail[0].alertType === 'subtitle' ? (
					<div style={{ width: '100%' }}>
						<AlertBar message={wordFail[0].msg} type={wordFail[0].variant} />
					</div>
				) : null
			) : null}
			<form onSubmit={uploadSubtitle} style={{ color: 'white' }}>
				<input style={{ maxWidth: '50vw' }} type='file' name='subtitle' ref={fileInput} accept='.srt' />
				<button onClick={uploadSubtitle}>Upload</button>
			</form>
			<Typography variant='h6' style={{ color: 'white' }}>
				Only srt files are allowed.
			</Typography>
			<Typography variant='h6' style={{ color: 'white' }}>
				File size should be less than 1MB.
			</Typography>
			<br />
			<Button variant='contained' color='primary' onClick={extractSubtitleFunction}>
				Extract
			</Button>
			{extractSubtitleLoading ? (
				<div style={{ margin: '5vh 5vw' }}>
					<CircularProgress />
				</div>
			) : null}
			{wordFail.length ? (
				wordFail[0].alertType === 'word' || wordFail[0].alertType === 'extractWords' ? (
					<AlertBar message={wordFail[0].msg} type={wordFail[0].variant} />
				) : null
			) : null}
			{subtitle.subtitleWords.length ? (
				<div className={styles.header}>
					<div style={{ float: 'right' }}>
						{subtitle.lowerLimit !== 0 ? <ArrowBackIcon onClick={e => prevButton(e)} /> : null}
						{subtitle.upperLimit <= subtitle.subtitleWords.length ? <ArrowForwardIcon onClick={e => nextButton(e)} /> : null}
					</div>
					<Typography variant='h4' className={styles.wordLength}>
						Total {subtitle.subtitleWords.length} words for you!
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								{subtitle.current10.map(each => (
									<Grid key={uuidv4()} item>
										<Paper className={styles.eachWord}>
											<Typography variant='h6'>{each}</Typography>
											<div>
												<Chip label='Delete' color='secondary' onClick={e => deleteWord(e, each)} />
												{'  '}
												<Chip label='Add' color='primary' onClick={e => addWord(e, each)} />
											</div>
										</Paper>
									</Grid>
								))}
							</Grid>
						</Grid>
					</Grid>
				</div>
			) : null}
		</Fragment>
	);
};

SubtitleFileUpload.propTypes = {
	newWord: PropTypes.func.isRequired,
	addSubtitle: PropTypes.func,
	extractSubtitleAction: PropTypes.func,
	changeLimit: PropTypes.func,
	changeCurrent10: PropTypes.func,
};

const mapStateToProps = state => {
	return {
		wordFail: state.alert,
		subtitle: state.subtitle,
	};
};

export default connect(mapStateToProps, { newWord, addSubtitle, extractSubtitleAction, changeLimit, changeCurrent10 })(SubtitleFileUpload);
