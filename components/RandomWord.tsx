import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import { Typography } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import CircularProgress from '@material-ui/core/CircularProgress';
const parse = require('html-react-parser');
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tooltip from '@material-ui/core/Tooltip';
import styles from '../styles/RandomWord.module.css';
import { Pagination } from '@material-ui/lab';
import BouncingBallLoader from './BouncingBallLoader';
import clsx from 'clsx';
const ud = require('urban-dictionary');
import _ from 'lodash';
import Link from 'next/link';

const RandomWord = () => {
	const [page, setPage] = React.useState(1);
	const [randomWord, setRandomWord] = useState([]);

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const onClick = (each: { word: any }, id: number) => {
		console.log(each.word);
		const newArray = randomWord.map(eachWord => {
			if (each.word === eachWord.word) {
				eachWord.currentDef += id;
			}
			return eachWord;
		});
		setRandomWord(newArray);
	};

	useEffect(() => {
		async function fetchWords2() {
			try {
				setRandomWord([]);
				const res = await Axios.get('/api/home');
				res.data.forEach(each => {
					ud.define(each.word, (error, results) => {
						if (error) {
							setRandomWord(prevArray => [
								...prevArray,
								{
									word: each.word,
									title: each.title,
									addedBy: each.added_by,
									upvotes: each.upvotes,
									poster: each.poster_path,
									definition: null,
									ResponseWord: 200,
									ResponseDef: 500,
									ResponseWordText: null,
									currentDef: 0,
								},
							]);
						} else {
							const array = _.reverse(
								_.sortBy(
									_.filter(results, function (o) {
										return o.word.toLowerCase() === each.word;
									}),
									[
										function (o) {
											return o.thumbs_up - o.thumbs_down;
										},
									]
								)
							);
							setRandomWord(prevArray => [
								...prevArray,
								{
									word: each.word,
									title: each.title,
									addedBy: each.added_by,
									upvotes: each.upvotes,
									poster: each.poster_path,
									definition: array ? array : null,
									ResponseWord: 200,
									ResponseDef: array ? 200 : 500,
									ResponseWordText: null,
									currentDef: 0,
								},
							]);
						}
					});
				});
			} catch (err) {
				console.log(err);
				setRandomWord(prevArray => [
					...prevArray,
					{
						word: null,
						title: null,
						addedBy: null,
						upvotes: null,
						poster: null,
						definition: null,
						ResponseWord: 404,
						ResponseDef: null,
						ResponseWordText: err.response.data,
						currentDef: 0,
					},
				]);
			}
		}
		fetchWords2();
	}, []);

	return (
		<div className={styles.container} style={{ minHeight: '100vh' }}>
			{randomWord.length == 2 ? (
				<Fragment>
					<div className={styles.pagination}>
						<Typography gutterBottom className={styles.textCentre}>
							Number of Word(s)
						</Typography>
						<Pagination count={2} color='secondary' page={page} onChange={handleChange} />
					</div>
					<div className={styles.gridWrapper}>
						{randomWord.map((each, index) => {
							return (
								<div key={uuidv4()} className={styles.wrapper}>
									{each.word && index + 1 <= page ? (
										<Fragment>
											<div className={styles.imgContent}>
												<img
													className={styles.image1}
													src={`https://image.tmdb.org/t/p/w500/${each.poster}`}
													alt='movie poster'
												/>
											</div>
											<div className={styles.info}>
												<Typography variant='h2' className={styles.textCentre}>
													{each.word}
												</Typography>
												<Typography variant='h4' className={clsx(styles.movieName)}>
													From movie: <b>{each.title}</b>
												</Typography>
												{each.definition ? (
													<Fragment>
														<Typography variant='h5'>
															{each.currentDef === 0 ? null : (
																<Tooltip title='Previous definition' placement='right'>
																	<span onClick={e => onClick(each, -1)}>
																		<ArrowBackIcon fontSize='large' /> {'   '}
																	</span>
																</Tooltip>
															)}
															{each.currentDef === each.definition.length - 1 ? null : (
																<Tooltip title='Next Defintion' placement='right'>
																	<span onClick={e => onClick(each, +1)}>
																		<ArrowForwardIcon fontSize='large' />
																	</span>
																</Tooltip>
															)}
														</Typography>

														<Typography variant='h5' className={clsx(styles.definitionText)}>
															<p
																style={{
																	textAlign: 'center',
																	fontSize: '24px',
																	fontWeight: 'bolder',
																	marginBottom: 0,
																}}
															>
																Definition:{' '}
															</p>{' '}
															<p>{parse(each.definition[each.currentDef].definition)}</p>
															{each.definition[each.currentDef].example ? (
																<Fragment>
																	<p
																		style={{
																			textAlign: 'center',
																			fontSize: '24px',
																			fontWeight: 'bolder',
																			marginBottom: 0,
																		}}
																	>
																		Example:
																	</p>
																	<p>{parse(each.definition[each.currentDef].example)}</p>
																</Fragment>
															) : null}
														</Typography>
														<Link href={each.definition[each.currentDef].permalink}>
															<a target='_blank' className={clsx(styles.rLink, styles.link, styles.textUnderlined)}>
																read more
															</a>
														</Link>
													</Fragment>
												) : each.ResponseDef ? (
													<Typography variant='h5'>Couldn't load definitions.</Typography>
												) : (
													<div
														style={{
															textAlign: 'center',
															margin: '20px 20px',
														}}
													>
														<CircularProgress />
													</div>
												)}
												<Typography variant='h5'>
													Total votes: <b>{each.upvotes}</b>
												</Typography>
											</div>
										</Fragment>
									) : each.ResponseWord ? (
										each.ResponseWord === 404 ? (
											<div>{parse(each.ResponseWordText)}</div>
										) : (
											<div>{each.ResponseWordText}</div>
										)
									) : (
										<div style={{ textAlign: 'center' }}>
											<CircularProgress />
										</div>
									)}
								</div>
							);
						})}
					</div>
				</Fragment>
			) : (
				<div style={{ margin: '40vh 40vw' }}>
					<BouncingBallLoader message='random movie word(s) ...' variant='purpleHUE' />
				</div>
			)}
		</div>
	);
};

export default RandomWord;
