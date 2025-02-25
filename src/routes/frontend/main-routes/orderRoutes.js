import express from 'express';
import { createOrder, payment } from '../../../controllers/frontend/ordercontroller.js';

const orderRouter = express.Router();

orderRouter.post('/create',createOrder);
orderRouter.post('/payment',payment);

export default orderRouter;