import mongoose from 'mongoose';
import { brandModel } from '../../models/BrandModel.js';
import { serverError } from '../../utils/ErrorHandler.js';
import path from 'path';


export const createBrand = async(req,res,next) => {
    try{
        const { brandname } = req.body;
        
        let brandimage;
        
                req.files.forEach((file) => {
                    if (file.fieldname == 'image') {
                        brandimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                    }
                });

        if(!brandname){
            return res.status(422).json({ message: 'brand name is required' });
        }

        const existingData =await brandModel.findOne({name:brandname});
        
        if(existingData){
            return res.status(422).json({message:'brand already exists'});
        }


        await brandModel.create({
            name: brandname,
            image:brandimage
        });
        return res.status(200).json({ message: 'brand created'});
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
                    image: 1,
                }
            }
        ]);

        if(!brand){
            return res.status(422).json({ message: 'No brands found'});
        }

        return res.status(200).json(
            {
                message: 'fetched brands',
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
            message: 'fetched brand',
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

        let brandimage = req.body.image;
                if (req.files) {
                    req.files.forEach((file) => {
                        if (file.fieldname == 'image') {
                            brandimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                        }
                    });
    
                    }

        if (!brandname) {
            return res.status(422).json({ message: 'brand name is required' });
        }

        const existingData = await brandModel.findOne({ name: brandname, _id: {$ne: brandId}, });

        if (existingData) {
            return res.status(422).json({ message: 'brand name already exist' });
        }

        const brand = await brandModel.findOne({
            _id: brandId,
            deletedAt: null,
        });

        brand.name = brandname;
        brand.image= brandimage;

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