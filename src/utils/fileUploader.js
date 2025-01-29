import multer from 'multer';
import slugify from 'slugify';
import { getUploadDir } from './fileUtils.js';

export const uploadFile = (path) => {
	const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

	//Using multer
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, getUploadDir(path));
		},
		filename: function (req, file, cb) {
			const name = slugify(file.originalname, { lower: true });
			cb(null, Date.now() + '-' + name);
		},
	});
	const fileFilter = (req, file, cb) => {
		if (!whitelist.includes(file.mimetype)) {
			return cb(new Error('file type is not allowed'));
		}
		cb(null, true);
	};

	return multer({ storage: storage, fileFilter: fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } });
	//End of using multer
};