import express from 'express';

import { getAllCategories } from '../../../controllers/frontend/categorypage.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/',getAllCategories);

export default categoriesRouter;