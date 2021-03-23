import React, { Fragment, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import { connect } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { logout } from '../store/actions/authAction';
import styles from '../styles/NavBar.module.css';
import clsx from 'clsx';

const NavBar = ({ isAuthenticated, user, logout }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const router = useRouter();

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClickLogout = () => {
		logout();
		router.push('/');
	};

	return (
		<Fragment>
			<AppBar style={{ width: '100%', position: 'absolute', backgroundColor: 'inherit' }}>
				<div style={{ margin: '15px 0px' }}>
					<Typography variant='h4'>
						<Link href='/'>
							<a className={clsx(styles.navbarBrand, styles.navbar)}>Home</a>
						</Link>
						{user && isAuthenticated ? (
							<span className='nav-profile-icon'>
								<Avatar aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick} src={user.avatar}></Avatar>
								<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
									<MenuItem onClick={handleClick}>
										<Link href='/users/userProfile'>
											<a>My Profile</a>
										</Link>
									</MenuItem>
									<MenuItem onClick={handleClickLogout}>Logout</MenuItem>
								</Menu>
							</span>
						) : (
							<Fragment>
								<Link href='/auth/login'>
									<a className={clsx(styles.navbarTabs, styles.navbar)}>Log In</a>
								</Link>
								<Link href='/auth/signup'>
									<a className={clsx(styles.navbarTabs, styles.navbar)}>Sign Up</a>
								</Link>
							</Fragment>
						)}
					</Typography>
				</div>
			</AppBar>
		</Fragment>
	);
};

NavBar.proptypes = {
	logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.isAuth,
		user: state.auth.user,
	};
};

export default connect(mapStateToProps, { logout })(NavBar);
