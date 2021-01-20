import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { alertReducer } from './alertReducer';
import { wordsReducer } from './wordsReducer';
import { movieImagesReducer } from './movieImagesReducer';
import { subtitleReducer } from './subtitlesReducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['auth'],
};

const rootReducer = combineReducers({
	auth: authReducer,
	alert: alertReducer,
	words: wordsReducer,
	images: movieImagesReducer,
	subtitle: subtitleReducer,
});

export default persistReducer(persistConfig, rootReducer);
