import { connect } from 'react-redux';
import { newVote, deleteWord } from '../store/actions/wordsAction';
import ThumbDownAltSharpIcon from '@material-ui/icons/ThumbDownAltSharp';
import ThumbUpAltSharpIcon from '@material-ui/icons/ThumbUpAltSharp';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import { Fragment } from 'react';
var randomColor = require('randomcolor');
import ClearIcon from '@material-ui/icons/Clear';
import { motion } from 'framer-motion';

const EachWord = ({ each, user, userUpvotes, userDownvotes, movieId, newVote, deleteWord }) => {
	// For upvoting and downvoting
	const handleClick = async (word_id, vote) => {
		if (user) {
			try {
				newVote({ user, word_id, vote, movieId });
			} catch (err) {
				alert(err.response.data);
				console.log(err.response.data);
			}
		} else {
			alert('Please login to vote!');
		}
	};

	const handleDeleteWord = async (e, word) => {
		deleteWord({ user, word, movieId });
	};

	return (
		<Fragment>
			<motion.div
				className='each-word-wrapper'
				style={{
					backgroundColor: randomColor({
						format: 'rgb',
						luminosity: 'dark',
					}),
				}}
			>
				<div className='word'>{each.word}</div>
				<div className='upvote'>
					{user ? (
						userUpvotes.filter(eachUserUpvotes => eachUserUpvotes.word_id === each.id).length ? (
							<ThumbUpAltSharpIcon onClick={() => handleClick(each.id, +1)} />
						) : (
							<ThumbUpAltOutlinedIcon onClick={() => handleClick(each.id, +1)} />
						)
					) : (
						<ThumbUpAltOutlinedIcon onClick={() => handleClick(each.id, +1)} />
					)}
				</div>
				<div className='votes'>{each.upvotes}</div>
				<div className='downvote'>
					{user ? (
						userDownvotes.filter(eachUserDownvotes => eachUserDownvotes.word_id === each.id).length ? (
							<ThumbDownAltSharpIcon onClick={() => handleClick(each.id, -1)} />
						) : (
							<ThumbDownOutlinedIcon onClick={() => handleClick(each.id, -1)} />
						)
					) : (
						<ThumbDownOutlinedIcon onClick={() => handleClick(each.id, -1)} />
					)}
				</div>
				<ClearIcon onClick={e => handleDeleteWord(e, each.word)} />
			</motion.div>
		</Fragment>
	);
};

const mapStateToProps = state => {
	return {
		user: state.auth.user,
		userUpvotes: state.words.upvotes,
		userDownvotes: state.words.downvotes,
	};
};

export default connect(mapStateToProps, { newVote, deleteWord })(EachWord);
