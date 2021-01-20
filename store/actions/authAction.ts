import * as types from '../types';
import Axios from 'axios';
import { setAlert } from './alertAction';
import { withRouter } from 'next/router';

// Loading user
export const loadUser = () => async dispatch => {
	try {
		// https://stackoverflow.com/questions/43051291/attach-authorization-header-for-all-axios-requests
		if (localStorage.jwtToken) {
			Axios.defaults.headers.common['auth-header-token'] = localStorage.jwtToken;
		} else {
			delete Axios.defaults.headers.common['auth-header-token'];
		}
		const res = await Axios.get('/api/auth');
		dispatch({
			type: types.USER_LOADED,
			payload: res.data.user,
		});
	} catch (err) {
		dispatch({
			type: types.AUTH_ERROR,
		});
		console.log(err);
	}
};

// Signing up user
export const signup = ({ username, email, password }) => async dispatch => {
	const newUser = {
		username,
		email,
		password,
	};
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const body = JSON.stringify(newUser);
		const res = await Axios.post('/api/users', body, config);
		if (res.data.error) {
			throw new Error(res.data.error);
		}
		dispatch({
			type: types.REGISTER_SUCCESS,
		});
		return 'success';
		// browserHistory.push('/auth/verify');
	} catch (err) {
		console.log(`Came here in catch`);
		console.log(err.response);
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach(error => {
				return dispatch(setAlert(error.msg, error.param, 'error'));
			});
		}
		dispatch({
			type: types.REGISTER_FAIL,
		});
	}
};

// logging in user
export const login = ({ email, password }) => async dispatch => {
	const formData = {
		email,
		password,
	};
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const body = JSON.stringify(formData);
		const res = await Axios.post('/api/login', body, config);
		if (res.data.error) {
			throw new Error(res.data.error);
		}
		dispatch({
			type: types.LOGIN_SUCCESS,
			payload: res.data,
		});
		dispatch(loadUser());
	} catch (err) {
		if (err.response.data.errors) {
			const errors = err.response.data.errors;
			if (errors) {
				errors.forEach(error => {
					return dispatch(setAlert(error.msg, error.param, 'error'));
				});
			}
		}
		dispatch({
			type: types.LOGIN_FAIL,
		});
	}
};

// Verifying a user
export const verifyUser = ({ userId, userEmailHash }) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const formData = {
			userId,
			userEmailHash,
		};
		const body = JSON.stringify(formData);
		const res = await Axios.post('/api/auth/verify', body, config);
		alert(res.data.msg);
		dispatch({
			type: types.VERIFICATION_SUCCESS,
		});
	} catch (err) {
		alert(err.response.data.error);
	}
};

// Logging out the user
export const logout = () => async dispatch => {
	dispatch({
		type: types.LOGOUT,
	});
};
