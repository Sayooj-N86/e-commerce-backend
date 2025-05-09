import jwt from 'jsonwebtoken';
import env from '../../env.js';

export const userMiddleware = (req, res, next) => {
	const adminheader = req.headers.authorization;
	
	if (!adminheader) {
		return res.status(401).json({
			success: false,
			message: 'access token not found',
		});
	}
	
	try {
		const token = adminheader.split(' ')[1];
		const decodeData = jwt.verify(token, env.USER_JWT_SECRET_KEY);
		// console.log('decodeData......',decodeData);
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
