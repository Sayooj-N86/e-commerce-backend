import express from 'express';
import homeRouter from './main-routes/homeRoutes.js';
import categoriesRouter from './main-routes/categoryRoutes.js';
import productsRouter from './main-routes/productRoutes.js';

const frontendPublicRouter = express.Router();


frontendPublicRouter.use('/home',homeRouter);
frontendPublicRouter.use('/categories',categoriesRouter);
frontendPublicRouter.use('/products',productsRouter);

export default frontendPublicRouter;