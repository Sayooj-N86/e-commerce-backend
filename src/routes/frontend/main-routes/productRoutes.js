import express from 'express';
import { getAllProducts, getOneProductById } from '../../../controllers/frontend/productpage.js';

const productsRouter = express.Router();

productsRouter.get('/:id',getAllProducts);
productsRouter.get('/single/:id',getOneProductById);


export default productsRouter;