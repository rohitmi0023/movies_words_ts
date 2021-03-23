import * as types from '../types';
import axios from 'axios';
import Axios from 'axios';

export const randomImagesAddition = () => async dispatch => {
	try {
		if (localStorage.jwtToken) {
			delete Axios.defaults.headers.common['auth-header-token'];
		}
		const urlForMovie = await axios.get(
			`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=en-US&include_adult=false&page=1`
		);
		if (urlForMovie.data.results.length) {
			const imagesArray = urlForMovie.data.results.slice(0, 10).map((each, index) => {
				if (index >= 10) {
					return;
				}
				return {
					poster: each.poster_path,
				};
			});
			dispatch({
				type: types.RANDOM_IMAGES_ADDITION,
				payload: imagesArray,
			});
		}
	} catch (err) {
		dispatch({
			type: types.RANDOM_IMAGES_ADDITION_FAILED,
			payload: [],
		});
		console.log(err.message);
		console.log(err.response);
	}
};

export const randomNumberFunction = () => async dispatch => {
	const number = Math.floor(Math.random() * 10);
	dispatch({
		type: types.RANDOM_NUMBER,
		payload: number,
	});
};

export const currentMoviePoster = poster => async dispatch => {
	dispatch({
		type: types.CURRENT_IMAGE,
		payload: poster,
	});
};
