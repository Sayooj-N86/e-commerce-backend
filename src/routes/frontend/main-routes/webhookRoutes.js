import express from 'express';
import { createWebhook } from '../../../webhook/PaymentWebhook.js';


export const webhookRouter = express.Router();
// webhookRouter.use(express.json());
webhookRouter.post('/stripe',createWebhook);