import express from 'express';
import orderRouter from './main-routes/orderRoutes.js';
import { userMiddleware } from '../../middleware/Usermiddleware.js';

const frontendPrivateRouter = express.Router();

    // frontendPrivateRouter.use(userMiddleware);
frontendPrivateRouter.use('/order',orderRouter);

export default frontendPrivateRouter;