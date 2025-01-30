import express from 'express';
import {
	createBanner,
	deleteBanner,
	getAllBanner,
	getBannerById,
	updateBanner,
} from '../../../controllers/dashboard/BannerController.js';
import { uploadFile } from '../../../utils/fileUploader.js';

const bannerRouter = express.Router();

bannerRouter.post('/create', uploadFile('banner').any(), createBanner);
bannerRouter.get('/get-all', getAllBanner);
bannerRouter.get('/get-one/:id', getBannerById);
bannerRouter.put('/update/:id', uploadFile('banner').any(), updateBanner);
bannerRouter.delete('/delete/:id', deleteBanner);

export default bannerRouter;
