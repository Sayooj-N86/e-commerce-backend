import express from 'express';
import dashboardPrivateRouter from './DashBoardPrivateRoutes.js';
import dashboardPublicRouter from './DashBoardPublicRoutes.js';

const dashboardRoutes = express.Router();

dashboardRoutes.use(dashboardPublicRouter);
dashboardRoutes.use(dashboardPrivateRouter);

export default dashboardRoutes;
