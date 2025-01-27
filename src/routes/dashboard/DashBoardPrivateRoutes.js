import express from 'express';
import categoryRouter from './main-routes/CategoryRoutes.js';

const dashboardPrivateRouter = express.Router()

dashboardPrivateRouter.use("/category",categoryRouter);

export default dashboardPrivateRouter;