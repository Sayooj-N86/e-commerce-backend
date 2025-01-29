import express from 'express';
import { createBrand, deleteBrand, getAllBrand, getBrandById, updateBrand } from '../../../controllers/dashboard/BrandController.js';


const brandRouter = express.Router();

brandRouter.post('/create',createBrand);
brandRouter.get('/get-all',getAllBrand);
brandRouter.get('/get-one/:id',getBrandById);
brandRouter.put('/update/:id',updateBrand);
brandRouter.delete('/delete/;id',deleteBrand);

export default brandRouter;