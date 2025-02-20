import jwt from 'jsonwebtoken';
import env from '../../env.js';

export const adminMiddleware = (req, res, next) => {
	const adminheader = req.headers.authorization;

	if (!adminheader) {
		return res.status(401).json({
			success: false,
			message: 'access token i=not found',
		});
	}

	try {
		const token = adminheader.split(' ')[1];
		const decodeData = jwt.verify(token, env.JWT_SECRET_KEY);

		if (!decodeData) {
			return res.status(401).json({
				success: false,
				message: 'Access token expired',
			});
		}

		req.user = decodeData;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: 'access token expired',
		});
	}
};
