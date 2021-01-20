// Uploading subtiles to aws by presigned method

// const connection = require('../../../../db/dbconfig');
// const multer = require('multer');
import { v4 as uuidv4 } from 'uuid';
import nc from 'next-connect';
const handler = nc();
const jwt = require('jsonwebtoken');
import aws from 'aws-sdk';

interface ExtendedRequest {
	user: string;
	body: {
		key: String;
	};
	query: {
		movieId: Number;
		user: String;
	};
}

interface ExtendedResponse {
	cookie: (name: string, value: string) => void;
	status: any;
	json: any;
}

// Auth POST middleware
handler.use((req, res, next) => {
	const token = req.headers['auth-header-token'];
	if (!token) {
		return res.status(401).json({ message: 'Please login to add subtitle files!', type: 'authentication' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;
	} catch (err) {
		return res.status(401).json({ message: 'Please login again to add subtitle files!', type: 'authentication' });
	}
	next();
});

handler.get<ExtendedRequest, ExtendedResponse>(async (req, res) => {
	aws.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY,
		region: process.env.AWS_REGION,
		signatureVersion: 'v4',
	});
	const s3 = new aws.S3();
	const fileName = `${req.query.user}/${req.query.movieId}/${uuidv4()}`;
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Fields: {
			key: fileName,
		},
		Expires: 60, // seconds
		Conditions: [
			['content-length-range', 0, 1048576], // up to 1 MB
		],
	};
	await s3.createPresignedPost(params, (err, data) => {
		if (data) {
			return res.status(200).json(data);
		}
		if (err) {
			return res.status(500).json({ message: 'Upload Failed!', type: 'subtitle' });
		}
	});
});

export default handler;
