import Router from 'next/router';
import styles from '../styles/SearchResults.module.css';
import InputTwoToneIcon from '@material-ui/icons/InputTwoTone';
import { currentMoviePoster } from '../store/actions/movieImagesAction';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fragment } from 'react';

const SearchResult = ({ searchresult, currentMoviePoster }) => {
	let moviesList = [];

	const handleClick = (Id, poster) => {
		currentMoviePoster({ poster });
		Router.push(`/movies/[movieId]/dict`, `/movies/${Id}/dict`);
	};

	moviesList = searchresult.Search.map(movie => {
		if (movie.poster_path) {
			return (
				<div key={movie.id}>
					<a onClick={e => handleClick(movie.id, movie.poster_path)}>
						<div className={styles.movie}>
							<div className={styles.info}>
								<div className={styles.text}>
									<p className={styles.movieTitle}>{movie.original_title}</p>
									<p className={styles.movieTitle}>{movie.release_date}</p>
									<p style={{ marginBottom: 0 }}>Enter into it!</p>
									<p>
										<InputTwoToneIcon />
									</p>
								</div>
							</div>
							<div className={styles.imgContent}>
								<img
									src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
									className={styles.moviePoster}
									alt='Movie poster'
								/>
							</div>
						</div>
					</a>
				</div>
			);
		}
	});
	return (
		<Fragment>
			<p className={styles.resultsText}>Search Results...</p>
			<div className={styles.gridWrapper} style={{ margin: '0 20px' }}>
				{moviesList}
			</div>
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
