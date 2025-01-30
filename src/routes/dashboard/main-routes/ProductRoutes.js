import express from 'express';
import {
	createProduct,
	deleteProduct,
	getAllProduct,
	getProductById,
	updateProduct,
} from '../../../controllers/dashboard/ProductController.js';
import { uploadFile } from '../../../utils/fileUploader.js';

const productRouter = express.Router();

productRouter.post('/create', uploadFile('product').any(), createProduct);
productRouter.get('/get-all', getAllProduct);
productRouter.get('/get-one/:id', getProductById);
productRouter.put('/update/:id', uploadFile('product').any(), updateProduct);
productRouter.delete('/delete/:id', deleteProduct);

export default productRouter;
