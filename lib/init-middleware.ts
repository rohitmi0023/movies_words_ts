// https://dev.to/meddlesome/nextjs-apis-validator-with-middleware-3njl#:~:text=NextJS%20is%20able%20to%20use,js%20inside%20your%20NextJS%20application.

export default function initMiddleware(middleware) {
	return (req, res) =>
		new Promise((resolve, reject) => {
			middleware(req, res, result => {
				if (result instanceof Error) {
					return reject(result);
				}
				return resolve(result);
			});
		});
}
