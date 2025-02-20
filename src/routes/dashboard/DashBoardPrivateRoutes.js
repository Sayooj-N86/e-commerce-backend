import express from 'express';
import categoryRouter from './main-routes/CategoryRoutes.js';
import brandRouter from './main-routes/BrandRoutes.js';
import productRouter from './main-routes/ProductRoutes.js';
import bannerRouter from './main-routes/BannerRoutes.js';
import {adminMiddleware} from '../../middleware/Adminmiddleware.js';

const dashboardPrivateRouter = express.Router();

dashboardPrivateRouter.use(adminMiddleware);
dashboardPrivateRouter.use('/categories',categoryRouter);
dashboardPrivateRouter.use('/brands',brandRouter);
dashboardPrivateRouter.use('/products',productRouter);
dashboardPrivateRouter.use('/banners',bannerRouter);

export default dashboardPrivateRouter;