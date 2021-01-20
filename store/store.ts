import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootreducer from './reducers';
import { persistStore } from 'redux-persist';

const initialState = {};

const middleware = [thunk];

export const store = createStore(
	rootreducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);

export default { store, persistor };
