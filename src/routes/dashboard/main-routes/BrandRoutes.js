import express from 'express';
import {
	createBrand,
	deleteBrand,
	getAllBrand,
	getBrandById,
	updateBrand,
} from '../../../controllers/dashboard/BrandController.js';
import { uploadFile } from '../../../utils/fileUploader.js';

const brandRouter = express.Router();

brandRouter.post('/create', uploadFile('brand').any(), createBrand);
brandRouter.get('/get-all', getAllBrand);
brandRouter.get('/get-one/:id', getBrandById);
brandRouter.put('/update/:id', uploadFile('brand').any(), updateBrand);
brandRouter.delete('/delete/;id', deleteBrand);

export default brandRouter;
