import express from 'express';
import frontendPublicRouter from './FrontendPublicRoutes.js';

const frontendRoutes = express.Router();

frontendRoutes.use(frontendPublicRouter);

export default frontendRoutes;
