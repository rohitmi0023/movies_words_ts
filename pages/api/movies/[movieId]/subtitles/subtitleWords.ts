// sending the uploaded subtitle file
import aws from 'aws-sdk';
import _ from 'lodash';
const readXlsxFile = require('read-excel-file/node');
var checkWord = require('check-word'),
	words = checkWord('en');
var Filter = require('bad-words'),
	badWordsFilter = new Filter();

export default async function handler(req, res) {
	aws.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_VERCEL,
		secretAccessKey: process.env.AWS_SECRET_KEY_VERCEL,
		region: process.env.AWS_REGION_VERCEL,
		signatureVersion: 'v4',
	});
	const s3 = new aws.S3();
	console.log(process.env.AWS_BUCKET_NAME);
	console.log(req.body.key);
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
			// subtitleWords.slice(0, 50);
			const parmaWords = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: `Words.xlsx`,
			};
			s3.getObject(parmaWords, async function (err, data) {
				if (err) {
					console.log(err, err.stack);
					return res.status(500).json({ message: 'Unable to fetch uploaded subtitle!!', type: 'extractSubtitle' });
				} else {
					try {
						console.log(`Came above readXlsxFile`);
						const res1Sheet = await readXlsxFile('./excel/Words.xlsx', { sheet: 1 });
						const res2Sheet = await readXlsxFile('./excel/Words.xlsx', { sheet: 2 });
						const res3Sheet = await readXlsxFile('./excel/Words.xlsx', { sheet: 3 });
						const res4Sheet = await readXlsxFile('./excel/Words.xlsx', { sheet: 4 });
						const res5Sheet = await readXlsxFile('./excel/Words.xlsx', { sheet: 5 });
						const totalSheets = _.concat(
							res1Sheet
							// res2Sheet, res3Sheet, res4Sheet, res5Sheet
						);
						const dataSheetWords = totalSheets
							.map(each =>
								each.filter(each2 => {
									if (each2 != null) {
										if (each2.length > 5) {
											return true;
										} else {
											return false;
										}
									} else {
										return false;
									}
								})
							)
							.filter(each => each.length);
						let unMatchedWords = subtitleWords.map(eachWord =>
							dataSheetWords.map(each => each.indexOf(eachWord)).filter(each => each !== -1)
						);
						unMatchedWords = subtitleWords.filter((each, index) => {
							if (!unMatchedWords[index].length && !badWordsFilter.isProfane(each)) {
								return true;
							} else {
								return false;
							}
						});
						// console.log(response);
						return res.status(200).send({
							response: unMatchedWords,
							words: subtitleWords,
						});
					} catch (err) {
						console.log(err);
						console.log(err.message);
						res.status(500).json({ message: 'Unable to extract words!', type: 'extractSubtitle' });
					}
				}
			});
		}
	});
}
