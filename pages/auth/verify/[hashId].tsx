import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { verifyUser } from '../../../store/actions/authAction';

const hashId = ({ verifyUser, isVerified }) => {
	const router = useRouter();
	useEffect(() => {
		if (isVerified) {
			router.push('/auth/login');
		}
		if (!isVerified) {
			const userId = window.location.pathname.replace('/auth/verify/', '');
			const userEmailHash = window.location.search.replace('?q=', '');
			verifyUser({ userId, userEmailHash });
		}
	}, [isVerified]);
	return (
		<Fragment>
			<h4>Please wait...</h4>
		</Fragment>
	);
};

const mapStateToProps = state => {
	return {
		isVerified: state.auth.isVerified,
	};
};

hashId.propTypes = {
	verifyUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { verifyUser })(hashId);
