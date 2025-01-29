import express from 'express';
import {
	createCategory,
	deleteCategory,
	getAllCategory,
	getCategoryById,
	updateCategory,
} from '../../../controllers/dashboard/CategoryController.js';
import { uploadFile } from '../../../utils/fileUploader.js';

const categoryRouter = express.Router();

categoryRouter.post('/create',uploadFile('category').any(), createCategory);
categoryRouter.get('/get-all', getAllCategory);
categoryRouter.get('/get-one/:id', getCategoryById);
categoryRouter.put('/update/:id', updateCategory);
categoryRouter.delete('/delete/:id', deleteCategory);

export default categoryRouter;
