import express from 'express';
import frontendPublicRouter from './FrontendPublicRoutes.js';
import frontendPrivateRouter from './FrontendPrivateRoutes.js';

const frontendRoutes = express.Router();

frontendRoutes.use(frontendPublicRouter);
frontendRoutes.use(frontendPrivateRouter)   ;

export default frontendRoutes;
