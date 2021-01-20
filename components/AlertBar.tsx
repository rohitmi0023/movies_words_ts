import React, { Fragment } from 'react';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AlertBar = ({ message, type }) => {
	const [open, setOpen] = React.useState(true);
	return (
		<div style={{ width: '100%' }}>
			<Collapse in={open} style={{ width: '100%', margin: '1vh 0', maxWidth: '50vw' }}>
				<Alert
					severity={type}
					action={
						<IconButton
							aria-label='close'
							color='inherit'
							size='small'
							onClick={() => {
								setOpen(false);
							}}
						>
							<CloseIcon fontSize='inherit' />
						</IconButton>
					}
					style={{ width: '100%' }}
				>
					{message}
				</Alert>
			</Collapse>
		</div>
	);
};

AlertBar.propTypes = {
	message: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
	return {
		wordFail: state.alert,
	};
};

export default connect(mapStateToProps)(AlertBar);
