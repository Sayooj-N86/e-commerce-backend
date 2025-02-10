import express from 'express';
import { homepageData } from '../../../controllers/frontend/homepage.js';

const homeRouter = express.Router();

homeRouter.get('/',homepageData);


export default homeRouter;  