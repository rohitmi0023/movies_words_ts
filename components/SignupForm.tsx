import React, { useState, Fragment } from 'react';
import { Form, FormGroup } from 'reactstrap';
import { connect, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { signup } from '../store/actions/authAction';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { setAlert } from '../store/actions/alertAction';

const SignUpForm = ({ signup, alertMessages, register_state }) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		rePassword: '',
	});

	const { username, email, password, rePassword } = formData;

	const onChange = e => {
		return setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (password !== rePassword) {
			dispatch(setAlert(`Passwords do not match`, 'repassword', 'error'));
		} else {
			const res = await signup({ username, email, password });
			if (res === 'success') {
				router.push('/auth/verify');
			}
		}
	};

	return (
		<Fragment>
			<Form>
				<FormGroup style={{ marginBottom: '7px' }}>
					<TextField
						error={Boolean(alertMessages.filter(alert => alert.alertType === 'username').length)}
						type='text'
						name='username'
						value={username}
						placeholder='User Name'
						onChange={e => onChange(e)}
						style={{ fontWeight: 'bolder' }}
						helperText={alertMessages.map(alert => {
							if (alert.alertType === 'username') {
								return alert.msg;
							}
						})}
					/>
				</FormGroup>
				<FormGroup style={{ marginBottom: '7px' }}>
					<TextField
						error={Boolean(alertMessages.filter(alert => alert.alertType === 'email').length)}
						type='email'
						name='email'
						value={email}
						placeholder='Email'
						onChange={e => onChange(e)}
						style={{ fontWeight: 'bolder' }}
						helperText={alertMessages.map(alert => {
							if (alert.alertType === 'email') {
								return alert.msg;
							}
						})}
					/>
				</FormGroup>
				<FormGroup style={{ marginBottom: '7px', color: 'white' }}>
					<TextField
						error={Boolean(alertMessages.filter(alert => alert.alertType === 'password').length)}
						type='password'
						name='password'
						value={password}
						placeholder='Password'
						onChange={e => onChange(e)}
						style={{ fontWeight: 'bolder' }}
						helperText={alertMessages.map(alert => {
							if (alert.alertType === 'password') {
								return alert.msg;
							}
						})}
					/>
				</FormGroup>
				<FormGroup>
					<TextField
						error={Boolean(alertMessages.filter(alert => alert.alertType === 'repassword').length)}
						type='password'
						name='rePassword'
						value={rePassword}
						placeholder='Re-enter password'
						onChange={e => onChange(e)}
						style={{ fontWeight: 'bolder' }}
						helperText={alertMessages.map(alert => {
							if (alert.alertType === 'repassword') {
								return alert.msg;
							}
						})}
					/>
				</FormGroup>
				<Button
					onClick={e => handleSubmit(e)}
					variant='outlined'
					color='primary'
					style={{
						backgroundColor: '#d66fd2',
						width: '100%',
						color: 'white',
						fontWeight: 'bold',
						marginTop: '15px',
					}}
				>
					Sign Up
				</Button>
			</Form>
		</Fragment>
	);
};

SignUpForm.propTypes = {
	signup: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
	return {
		alertMessages: state.alert,
		register_state: state.auth.register_state,
	};
};

export default connect(mapStateToProps, { signup })(SignUpForm);
