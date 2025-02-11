import express from 'express';
import dashboardPrivateRouter from './DashBoardPrivateRoutes.js';
import dashboardPublicRouter from './DashBoardPublicRoutes.js';

const dashboardRoutes = express.Router();

dashboardRoutes.use(dashboardPrivateRouter);
dashboardRoutes.use(dashboardPublicRouter);

export default dashboardRoutes;
