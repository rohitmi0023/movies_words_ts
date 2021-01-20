import * as types from '../types';

const movieImagesState = { randomImages: [], currentMovieImage: null, randomNumberState: null, loading: true };

export const movieImagesReducer = (state = movieImagesState, action) => {
	switch (action.type) {
		case types.RANDOM_IMAGES_ADDITION:
			return {
				...state,
				randomImages: action.payload,
				loading: false,
			};
		case types.RANDOM_IMAGES_ADDITION_FAILED:
			return {
				...state,
				randomImages: action.payload,
				loading: false,
			};
		case types.RANDOM_NUMBER:
			return {
				...state,
				randomNumberState: action.payload,
			};
		case types.CURRENT_IMAGE:
			return {
				...state,
				currentMovieImage: `https://image.tmdb.org/t/p/original${action.payload}`,
				loading: false,
			};
		default:
			return state;
	}
};
