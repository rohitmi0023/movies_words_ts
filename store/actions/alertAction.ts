import * as types from '../types';
import { v4 as uuidv4 } from 'uuid';

export const setAlert = (msg, alertType, variant, timeout = 4000) => async dispatch => {
	const id = uuidv4();
	dispatch({
		type: types.SET_ALERT,
		payload: { msg, alertType, variant, id },
	});
	setTimeout(() => dispatch({ type: types.REMOVE_ALERT, payload: id }), timeout);
};
