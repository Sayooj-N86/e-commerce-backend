import express from 'express';
import { createProduct, deleteProduct, getAllProduct, getProductById, updateProduct } from '../../../controllers/dashboard/ProductController.js';


const productRouter = express.Router();

productRouter.post('/create',createProduct);
productRouter.get('/get-all',getAllProduct);
productRouter.get('/get-one/:id',getProductById);
productRouter.put('/update/:id',updateProduct);
productRouter.delete('/delete/:id',deleteProduct);


export default productRouter;