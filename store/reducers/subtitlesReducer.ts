import * as types from '../types';

const subtitlesState = {
	subtitleWords: [],
	current10: [],
	lowerLimit: 0,
	upperLimit: 10,
	movieId: null,
};

export const subtitleReducer = (state = subtitlesState, action) => {
	switch (action.type) {
		case types.SUBTITLES_WORD_ADD:
			console.log(action.payload);
			return {
				...state,
				subtitleWords: action.payload.data,
				current10: action.payload.data.slice(0, 10),
				movieId: action.payload.movieId,
			};
		case types.CHANGE_LIMIT:
			return {
				...state,
				lowerLimit: state.lowerLimit + action.payload,
				upperLimit: state.upperLimit + action.payload,
				current10: state.subtitleWords.slice(state.lowerLimit + action.payload, state.upperLimit + action.payload),
			};
		case types.CHANGE_CURRENT10:
			return {
				...state,
				current10: action.payload.subtitleWordsArray.slice(state.lowerLimit, state.upperLimit),
				subtitleWords: action.payload.subtitleWordsArray,
			};
		default:
			return state;
	}
};
