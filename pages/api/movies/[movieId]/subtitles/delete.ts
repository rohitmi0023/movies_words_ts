// Deleting the existing AWS file
import aws from 'aws-sdk';
import nc from 'next-connect';
const handler = nc();
const jwt = require('jsonwebtoken');

interface ExtendedRequest {
	user: string;
	query: {
		movieId: Number;
		user: String;
	};
	body: {
		key: string;
	};
}

interface ExtendedResponse {
	cookie: (name: string, value: string) => void;
	status: any;
	json: any;
}

handler.use((req, res, next) => {
	const token = req.headers['auth-header-token'];
	if (!token) {
		return res.status(401).json({ message: 'Please login to delete subtitle files', type: 'authentication' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;
	} catch (err) {
		return res.status(402).json({ message: 'Please login again to delete subtitle files', type: 'authentication' });
	}
	next();
});

handler.post<ExtendedRequest, ExtendedResponse>(async (req, res) => {
	aws.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY,
		region: process.env.AWS_REGION,
		signatureVersion: 'v4',
	});
	var params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Delete: {
			Objects: [
				{
					Key: req.body.key,
				},
			],
			Quiet: false,
		},
	};
	var s3 = new aws.S3();
	s3.deleteObjects(params, function (err, data) {
		if (err) {
			// an error occurred
			return res.status(500).json({ message: 'Upload Failed!', type: 'subtitle' });
		} else {
			return res.status(200).json(data);
		}
	});
});

export default handler;
