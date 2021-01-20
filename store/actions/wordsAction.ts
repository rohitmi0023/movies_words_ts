import * as types from '../types';
import Axios from 'axios';
import { setAlert } from './alertAction';

export const loadWords = ({ movieId }) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const res = await Axios.get(`/api/movies/${movieId}/dict`, config);
		dispatch({
			type: types.WORDS_LOADED,
			payload: res.data,
		});
	} catch (err) {
		if (err.response) {
			dispatch(setAlert(err.response.data.message, err.response.data.type, 'error'));
		}
	}
};

export const newWord = ({ currentMovie, userId, word }) => {
	return async dispatch => {
		const searchForm = {
			currentMovie,
			userId,
			word: word.toLowerCase(),
		};
		try {
			if (localStorage.jwtToken) {
				Axios.defaults.headers.common['auth-header-token'] = localStorage.jwtToken;
			} else {
				delete Axios.defaults.headers.common['auth-header-token'];
			}
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};
			const body = JSON.stringify(searchForm);
			const res = await Axios.post(`/api/movies/${currentMovie.movieId}/dict`, body, config);
			dispatch({
				type: types.NEW_WORD_ADDED,
				payload: res.data,
			});
			if (res.data.profane) {
				dispatch(setAlert('Profane word detected! This will be visible only to you.', 'words', 'info'));
			}
			return true;
		} catch (err) {
			if (err.response) {
				if (err.response.data) {
					const errors = err.response.data.errors;
					if (errors) {
						errors.forEach(error => {
							return dispatch(setAlert(error.msg, 'newWord', 'error'));
						});
					}
				}
			} else {
				return dispatch(setAlert('Network Error', 'newWord', 'error'));
			}
		}
	};
};

export const userVoting = ({ user, movieId }) => async dispatch => {
	const userId = user.id;
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const votesRes = await Axios.get(`/api/movies/${movieId}/dict/userVotes?userId=${userId}`, config);
		dispatch({
			type: types.USER_VOTING,
			payload: votesRes.data.votes,
		});
	} catch (err) {
		console.log(err.response);
		console.error(err.message);
		if (err.response) {
			setAlert(err.response.data.messsage, err.response.data.variant, 'error');
		}
		if (err.response.type) {
			setAlert(err.response.type.message, err.response.data.type, 'error');
		}
	}
};

export const newVote = ({ user, word_id, vote, movieId }) => async dispatch => {
	try {
		if (localStorage.jwtToken) {
			Axios.defaults.headers.common['auth-header-token'] = localStorage.jwtToken;
		} else {
			delete Axios.defaults.headers.common['auth-header-token'];
		}
		const word_id_var = {
			userId: user.id,
			word_id: word_id,
			vote: vote,
		};
		const body = JSON.stringify(word_id_var);
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		await Axios.post(`/api/movies/:id/dict/${word_id}`, body, config);
		dispatch(loadWords({ movieId }));
		dispatch(userVoting({ user, movieId }));
		// alert(res.data);
	} catch (err) {
		if (err.response) {
			alert(err.response.data.msg);
		}
	}
};

export const deleteWord = ({ user, word, movieId }) => async dispatch => {
	try {
		if (localStorage.jwtToken) {
			Axios.defaults.headers.common['auth-header-token'] = localStorage.jwtToken;
		} else {
			delete Axios.defaults.headers.common['auth-header-token'];
		}
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const word_delete = {
			userId: user ? user.id : null,
			word,
			movieId,
		};
		const body = JSON.stringify(word_delete);
		const res = await Axios.post(`/api/movies/:id/dict/delete`, body, config);
		dispatch({
			type: types.DELETE_WORD,
			payload: word,
		});
		dispatch(setAlert(res.data, 'words', 'success'));
	} catch (err) {
		console.log(err);
		if (err.response) {
			dispatch(setAlert(err.response.data, 'words', 'error'));
		}
	}
};
