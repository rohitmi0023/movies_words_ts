import { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { newVote } from '../store/actions/wordsAction';
import Switch from '@material-ui/core/Switch';
import EachWord from './EachWord';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import styles from '../styles/WordResults.module.css';
import AlertBar from './AlertBar';
import BouncingBallLoader from './BouncingBallLoader';

const WordResults = ({ totalWords, user, movieId, isAuthenticated, loadingWords, loadingUserVoting, wordFail }) => {
	// material ui implementation of switch
	const [toggleState, setToggleState] = useState({
		checkedA: Boolean(user) ? true : false,
	});

	const wordList = each => {
		if (toggleState.checkedA) {
			// user words demanded
			if (user) {
				if (each.added_by === user.id) {
					return <EachWord each={each} movieId={movieId} />;
				} else {
					// word is not of user
					return;
				}
			}
		} else {
			// all words excluding profane words
			if (each.profane) {
				return;
			} else {
				return <EachWord each={each} movieId={movieId} />;
			}
		}
	};

	let totalwords = totalWords.map(each => {
		return <Fragment key={each.id}>{wordList(each)}</Fragment>;
	});

	const handleChange = event => {
		setToggleState({ ...toggleState, [event.target.name]: event.target.checked });
	};

	return (
		<Fragment>
			{user && isAuthenticated ? (
				// logged in user
				<FormControlLabel
					style={{ float: 'right', color: 'white' }}
					control={<Switch checked={toggleState.checkedA} onChange={handleChange} name='checkedA' color='primary' />}
					label='My words'
				/>
			) : // not displaying switch for not logged in user
			null}
			{wordFail.length ? (
				wordFail[0].alertType === 'words' ? (
					<div>
						<AlertBar message={wordFail[0].msg} type={wordFail[0].variant} />
						<br />
					</div>
				) : null
			) : null}
			{/* User is logged in or not, if not just check for words, if logged in check for uservotes as well */}
			{user ? (
				!loadingUserVoting && !loadingWords ? (
					totalWords.length ? (
						<div className='word-wrapper'>{totalwords}</div>
					) : (
						<p className={styles.info}>No word added yet!</p>
					)
				) : (
					<div style={{ margin: '5vh 40vw', color: 'white' }}>
						<BouncingBallLoader message='movie words ...' variant='indigoHUE' />
					</div>
				)
			) : !loadingWords ? (
				totalWords.length ? (
					<div className='word-wrapper'>{totalwords}</div>
				) : (
					<p className={styles.info}>No word added yet!</p>
				)
			) : (
				<div style={{ margin: '20px 0px', color: 'white' }}>
					<BouncingBallLoader message='movie words ...' variant='indigoHUE' />
				</div>
			)}
		</Fragment>
	);
};

const mapStateToProps = state => {
	return {
		user: state.auth.user,
		isAuthenticated: state.auth.isAuth,
		totalWords: state.words.totalWords,
		loadingWords: state.words.loadingWords,
		loadingUserVoting: state.words.loadingUserVoting,
		wordFail: state.alert,
	};
};

export default connect(mapStateToProps, { newVote })(WordResults);
