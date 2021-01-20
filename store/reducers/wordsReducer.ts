import * as types from '../types';

const wordsState = {
	totalWords: [], //for the specific movie
	upvotes: [], //for the signed in user
	downvotes: [], //for the signed in user
	loadingWords: true, //words are loaded or not
	loadingUserVoting: true,
};

export const wordsReducer = (state = wordsState, action) => {
	switch (action.type) {
		case types.WORDS_LOADED:
			return {
				...state,
				loadingWords: false,
				totalWords: action.payload,
			};
		case types.NEW_WORD_ADDED:
			return {
				...state,
				loadingWords: false,
				totalWords: [...state.totalWords, action.payload],
			};
		case types.USER_VOTING:
			return {
				...state,
				loadingUserVoting: false,
				upvotes: action.payload.upvotes,
				downvotes: action.payload.downvotes,
			};
		case types.NEW_UPVOTE:
			return {
				...state,
				loadingUserVoting: false,
				upvotes: [...state.upvotes, action.payload],
			};
		case types.NEW_DOWNVOTE:
			return {
				...state,
				loadingUserVoting: false,
				downvotes: [...state.downvotes, action.payload],
			};
		case types.DELETE_WORD:
			return {
				...state,
				totalWords: state.totalWords.filter(each => each.word !== action.payload),
			};
		default:
			return state;
	}
};
