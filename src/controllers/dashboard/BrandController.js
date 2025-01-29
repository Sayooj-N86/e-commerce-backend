import mongoose from 'mongoose';
import { brandModel } from '../../models/BrandModel.js';
import { serverError } from '../../utils/ErrorHandler.js';

export const createBrand = async(req,res,next) => {
    try{
        const { brandname } = req.body;
        
        if(!brandname){
            return res.status(422).json({ message: 'category name is required' });
        }

        const existingData =await brandModel.findOne({name:brandname});
        
        if(existingData){
            return res.status(422).json({message:'Category already exists'});
        }


        await brandModel.create({
            name: brandname,
        });
        return res.status(200).json({ message: 'category created'});
    }
    catch (err){
        console.log(err);
        next(serverError());
    }
};

export const getAllBrand = async (req,res,next) => {
    try{
        const brand = await brandModel.aggregate([
            {
                $match: {
                    deletedAt: null,
                },
            },
            {
                $project: {
                    name: 1,
                    _id: 1,
                }
            }
        ]);

        if(!brand){
            return res.status(422).json({ message: 'No categories found'});
        }

        return res.status(200).json(
            {
                message: 'fetched categories',
                data: brand,
            }
        );
    }
    catch (err){
        next(serverError());
        }
};

export const getBrandById = async(req,res,next) => {
    try{
        const brandId = req.params.id;
        const brand = (await brandModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(brandId),
                    deletedAt: null,
                    },
                },{

                $project: {
                    name: 1,
                    _id: 1,
                    }
                }
        ])).at(0);
        return res.status(200).json({ 
            message: 'fetched category',
            data: brand,
        });
    }
    catch (err){
        console.log(err);
        next(serverError());
        }
};

export const updateBrand = async (req, res, next) => {

    try {

        const brandId = req.params.id;

        const { brandname } = req.body;

        if (!brandname) {
            return res.status(422).json({ message: 'Category name is required' });
        }

        const existingData = await brandModel.findOne({ name: brandname, _id: {$ne: brandId}, });

        if (existingData) {
            return res.status(422).json({ message: 'Category name already exist' });
        }

        const brand = await brandModel.findOne({
            _id: brandId,
            deletedAt: null,
        });

        brand.name = brandname;

        await brand.save();

        return res.status(200).json({
            message: 'Updated Successfully',
        });
    
    } catch (err) {
        console.log(err);
        next(serverError());
    }
};

export const deleteBrand = async (req, res, next) => {

    try {

        const brandId = req.params.id;

        //await CategoryModel.deleteOne({_id:categoryId})

        const brand = await brandModel.findOne({
            _id: brandId,
        });

        brand.deletedAt = new Date();

        await brand.save();

        return res.status(200).json({
            message: 'Deleted Successfully',
        });
    
    } catch (err) {
        console.log(err);
        next(serverError());
    }
};