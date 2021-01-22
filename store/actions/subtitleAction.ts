import Axios from 'axios';
import { setAlert } from './alertAction';
import * as types from '../types';
import _ from 'lodash';

export const addSubtitle = ({ user, fileInput, currentMovie }) => async dispatch => {
	if (localStorage.jwtToken) {
		Axios.defaults.headers.common['auth-header-token'] = localStorage.jwtToken;
	} else {
		delete Axios.defaults.headers.common['auth-header-token'];
	}
	if (user) {
		//User is logged in
		const blob = new Blob([fileInput.current.files[0]]);
		const file = fileInput.current.files[0];
		try {
			if (!file) {
				throw { message: 'Please select a file!', type: 'subtitle', variant: 'info' };
			}
			if (blob.size >= 1000000) {
				throw { message: 'File size exceeds 1MB!', type: 'subtitle', variant: 'info' };
			}
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};
			// checking if user with this movie had already uploaded file from the database
			const resDBGET = await Axios.get(`/api/movies/${currentMovie.movieId}/subtitles/db?user=${user.id}`);
			if (resDBGET.data.result) {
				// File already exists
				const r = confirm('Want to overwrite the existing file for this movie?');
				if (r === false) {
					// User does't want to upload this file now
					throw { message: 'Upload aborted!', type: 'subtitle', variant: 'info' };
				} else {
					// User wants to upload hence delete previous file first
					const deleteKey = {
						key: resDBGET.data.key,
					};
					const bodyDelete = JSON.stringify(deleteKey);
					await Axios.post(`/api/movies/${currentMovie.movieId}/subtitles/delete`, bodyDelete, config);
				}
			}
			// Adding new file by presigned method
			const res = await Axios.get(`/api/movies/${currentMovie.movieId}/subtitles?user=${user.id}`);
			const { url, fields } = res.data;
			const newUrl = `https://${url.split('/')[3]}.s3.amazonaws.com`;
			const formData = new FormData();
			console.log(`formData`);
			console.log(formData);
			console.log(file);
			const formArray = Object.entries({ ...fields, file: blob });
			console.log(formArray);
			formArray.forEach(([key, value]) => formData.append(key, value as any));
			// Uploading file to AWS
			await Axios({
				method: 'POST',
				url: newUrl,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				data: formData,
				responseType: 'text',
			});
			let formValue;
			if (resDBGET.data.key) {
				formValue = {
					deleteKey: resDBGET.data.key,
					addKey: res.data.fields.key,
				};
			} else {
				formValue = {
					addKey: res.data.fields.key,
				};
			}
			const body = JSON.stringify(formValue);
			// Adding new file info on db and Deleting previous file info if file already exists
			await Axios.post(`/api/movies/${currentMovie.movieId}/subtitles/db?user=${user.id}`, body, config);
			dispatch(setAlert('Upload success!', 'subtitle', 'success'));
		} catch (err) {
			console.log(err);
			console.log(err.message);
			console.log(err.response);
			if (err.type) {
				dispatch(setAlert(err.message, err.type, err.variant));
			}
			if (err.response) {
				dispatch(setAlert(err.response.data.message, err.response.data.type, 'error'));
			}
		}
	} else {
		dispatch(setAlert('Please login to add subtitles', 'subtitle', 'error'));
	}
};

export const extractSubtitleAction = ({ currentMovie, user }) => async dispatch => {
	dispatch({
		type: types.SUBTITLES_WORD_ADD,
		payload: { data: [], movieId: currentMovie.movieId },
	});
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
	// checking if subtitle for it is already added or not
	try {
		if (!user) {
			throw { message: 'Please login to extract subtitle words!', type: 'extractWords' };
		}
		const resDBGET = await Axios.get(`/api/movies/${currentMovie.movieId}/subtitles/db?user=${user.id}`);
		if (resDBGET.data.key) {
			const formData = {
				key: resDBGET.data.key,
			};
			const body = JSON.stringify(formData);
			// Fetching the suggested words
			const res = await Axios.post(`/api/movies/${currentMovie.movieId}/subtitles/subtitleWords`, body, config);
			console.log(res.data);
			dispatch({
				type: types.SUBTITLES_WORD_ADD,
				payload: { data: res.data.response, movieId: currentMovie.movieId },
			});
		} else {
			throw { message: "You have'nt added subtitle for this movie!", type: 'extractWords' };
		}
	} catch (error) {
		if (error.type) {
			dispatch(setAlert(error.message, error.type, 'error'));
		}
		if (error.response) {
			dispatch(setAlert(error.response.data.message, error.response.data.type, 'error'));
		}
		return [];
	}
};

export const changeLimit = limit => async dispatch => {
	dispatch({
		type: types.CHANGE_LIMIT,
		payload: limit,
	});
};

export const changeCurrent10 = ({ subtitle, each }) => async dispatch => {
	let current10Array = _.remove(subtitle.current10, eachWord => eachWord !== each);
	const subtitleWordsArray = _.remove(subtitle.subtitleWords, eachWord => eachWord !== each);
	current10Array = subtitleWordsArray.slice(0, 10);
	dispatch({
		type: types.CHANGE_CURRENT10,
		payload: { current10Array, subtitleWordsArray },
	});
};
