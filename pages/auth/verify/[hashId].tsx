import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { verifyUser } from '../../../store/actions/authAction';

const hashId = ({ verifyUser }) => {
	const router = useRouter();
	useEffect(() => {
		const userId = window.location.pathname.replace('/auth/verify/', '');
		const userEmailHash = window.location.search.replace('?q=', '');
		const res = verifyUser({ userId, userEmailHash });
		if (res) {
			router.push('/auth/login');
		}
	}, []);
	return (
		<Fragment>
			<h4>Please wait...</h4>
		</Fragment>
	);
};

hashId.propTypes = {
	verifyUser: PropTypes.func.isRequired,
};

export default connect({ verifyUser })(hashId);
