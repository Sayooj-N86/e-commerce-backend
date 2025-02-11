import express from 'express';
import authRouter from './main-routes/AuthRoutes.js';

const dashboardPublicRouter = express.Router();

dashboardPublicRouter.use('/auth',authRouter);

export default dashboardPublicRouter;