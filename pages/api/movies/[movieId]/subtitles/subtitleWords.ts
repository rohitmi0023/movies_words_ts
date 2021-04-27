// sending the uploaded subtitle file
import aws from 'aws-sdk';
import _ from 'lodash';
var checkWord = require('check-word'),
	words = checkWord('en');
var Filter = require('bad-words'),
	badWordsFilter = new Filter();
import xlsx from 'node-xlsx';

export default async function handler(req, res) {
	aws.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_VERCEL,
		secretAccessKey: process.env.AWS_SECRET_KEY_VERCEL,
		region: process.env.AWS_REGION_VERCEL,
		signatureVersion: 'v4',
	});
	const s3 = new aws.S3();
	var params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: req.body.key,
	};
	s3.getObject(params, async function (err, data) {
		if (err) {
			console.log(err, err.stack);
			return res.status(500).json({ message: 'Unable to fetch uploaded subtitle!', type: 'extractSubtitle', key: req.body.key });
		} else {
			let subtitleWords = _.uniq(
				data.Body.toString()
					.replace(/[^A-Za-z]/g, ' ')
					.toLowerCase()
					.replace(/\s+/g, ' ')
					.trim()
					.split(' ')
					.filter(each => each.length > 5)
					.filter(each => words.check(each))
			);
			const paramWords = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: `Words.xlsx`,
			};
			const start = Date.now();
			s3.getObject(paramWords, async function (err, data) {
				if (err) {
					console.log(err, err.stack);
					return res.status(500).json({ message: 'Unable to fetch uploaded subtitle!!', type: 'extractSubtitle' });
				} else {
					try {
						const totalSheets = xlsx.parse(data.Body);
						const dataSheetWords = totalSheets.map(each => {
							return each.data
								.map(each2 => {
									return each2.filter(each3 => {
										if (each3 != null) {
											if (each3.length > 5) {
												return true;
											} else {
												return false;
											}
										} else {
											return false;
										}
									});
								})
								.filter(each => each.length);
						});
						// console.log(dataSheetWords);
						// unmatched words will have empty array in unMatchedWords array list
						let unMatchedWords;
						// sheet 1
						unMatchedWords = subtitleWords.map(eachWord =>
							dataSheetWords[0].map(each => each.indexOf(eachWord)).filter(each => each !== -1)
						);
						// here unmatched words will contain words of that which were having null array item earlier
						subtitleWords = subtitleWords.filter((each, index) => {
							if (!unMatchedWords[index].length) {
								if (!badWordsFilter.isProfane(each)) return true;
							} else {
								return false;
							}
						});
						// sheet 2
						unMatchedWords = subtitleWords.map(eachWord =>
							dataSheetWords[1].map(each => each.indexOf(eachWord)).filter(each => each !== -1)
						);
						// here unmatched words will contain words of that which were having null array item earlier
						subtitleWords = subtitleWords.filter((each, index) => {
							if (!unMatchedWords[index].length) {
								if (!badWordsFilter.isProfane(each)) return true;
							} else {
								return false;
							}
						});
						// sheet 3
						unMatchedWords = subtitleWords.map(eachWord =>
							dataSheetWords[2].map(each => each.indexOf(eachWord)).filter(each => each !== -1)
						);
						// here unmatched words will contain words of that which were having null array item earlier
						subtitleWords = subtitleWords.filter((each, index) => {
							if (!unMatchedWords[index].length) {
								if (!badWordsFilter.isProfane(each)) return true;
							} else {
								return false;
							}
						});
						// sheet 4
						unMatchedWords = subtitleWords.map(eachWord =>
							dataSheetWords[3].map(each => each.indexOf(eachWord)).filter(each => each !== -1)
						);
						// here unmatched words will contain words of that which were having null array item earlier
						subtitleWords = subtitleWords.filter((each, index) => {
							if (!unMatchedWords[index].length) {
								if (!badWordsFilter.isProfane(each)) return true;
							} else {
								return false;
							}
						});
						// sheet 5
						unMatchedWords = subtitleWords.map(eachWord =>
							dataSheetWords[4].map(each => each.indexOf(eachWord)).filter(each => each !== -1)
						);
						// here unmatched words will contain words of that which were having null array item earlier
						subtitleWords = subtitleWords.filter((each, index) => {
							if (!unMatchedWords[index].length) {
								if (!badWordsFilter.isProfane(each)) return true;
							} else {
								return false;
							}
						});
						return res.status(200).send({
							response: subtitleWords,
							words: subtitleWords,
						});
					} catch (err) {
						console.log(err);
						console.log(err.message);
						res.status(500).json({ message: 'Unable to extract words!', type: 'extractSubtitle' });
					}
				}
			});
			console.log(`time taken`);
			console.log(Date.now() - start);
		}
	});
}
