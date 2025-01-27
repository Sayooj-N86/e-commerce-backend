import express from 'express';
import { createCategory, getAllCategory, getCategoryById } from '../../../controllers/dashboard/CategoryController.js';

const categoryRouter = express.Router();

categoryRouter.post("/create",createCategory);
categoryRouter.get("/get-all",getAllCategory);
categoryRouter.get("/get-one/:id",getCategoryById);

export default categoryRouter;