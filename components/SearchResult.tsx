import Router from 'next/router';
import styles from '../styles/SearchResults.module.css';
import InputTwoToneIcon from '@material-ui/icons/InputTwoTone';
import { currentMoviePoster } from '../store/actions/movieImagesAction';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fragment } from 'react';
import { motion } from 'framer-motion';

const SearchResult = ({ searchresult, currentMoviePoster }) => {
	let moviesList = [];

	const handleClick = (Id, poster) => {
		currentMoviePoster({ poster });
		Router.push(`/movies/[movieId]/dict`, `/movies/${Id}/dict`);
	};

	moviesList = searchresult.Search.map(movie => {
		if (movie.poster_path) {
			return (
				<motion.div key={movie.id} transition={{ duration: 1 }} animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
					<a onClick={e => handleClick(movie.id, movie.poster_path)}>
						<div className={styles.movie}>
							<motion.div className={styles.info} whileHover={{ scaleY: 1.1 }} transition={{ duration: 0.5 }}>
								<div className={styles.text}>
									<p className={styles.movieTitle}>{movie.original_title}</p>
									<p className={styles.movieTitle}>{movie.release_date}</p>
									<p style={{ marginBottom: 0 }}>Enter into it!</p>
									<p>
										<InputTwoToneIcon />
									</p>
								</div>
							</motion.div>
							<div className={styles.imgContent}>
								<img
									src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
									className={styles.moviePoster}
									alt='Movie poster'
								/>
							</div>
						</div>
					</a>
				</motion.div>
			);
		}
	});
	return (
		<Fragment>
			<p className={styles.resultsText}>Search Results...</p>
			<motion.div className={styles.gridWrapper} style={{ margin: '0 20px' }}>
				{moviesList}
			</motion.div>
		</Fragment>
	);
};

SearchResult.propTypes = {
	currentMoviePoster: PropTypes.func,
};

const mapStateToProps = state => {
	return {};
};

export default connect(mapStateToProps, { currentMoviePoster })(SearchResult);
