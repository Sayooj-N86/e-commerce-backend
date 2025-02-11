import express from 'express';
import { login, signUp } from '../../../controllers/dashboard/AuthController.js';

const authRouter = express.Router();

authRouter.post('/sign-up',signUp);
authRouter.post('/login',login);

export default authRouter;
