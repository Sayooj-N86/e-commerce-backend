import mongoose from 'mongoose';
import { brandModel } from '../../models/BrandModel.js';
import { serverError } from '../../utils/ErrorHandler.js';
import path from 'path';


export const createBrand = async(req,res,next) => {
    try{
        const { brand } = req.body;
        
        let brandimage;
        
                req.files.forEach((file) => {
                    if (file.fieldname == 'imageFile') {
                        brandimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                    }
                });

        if(!brand){
            return res.status(422).json({ message: 'brand name is required' });
        }

        const existingData =await brandModel.findOne({name:brand,deleteAt:null});
        
        if(existingData){
            return res.status(422).json({message:'brand already exists'});
        }


        await brandModel.create({
            name: brand,
            image:brandimage
        });
        return res.status(200).json({ message: 'brand created',success:true});
    }
    catch (err){
        console.log(err);
        next(serverError());
    }
};

export const getAllBrand = async (req,res,next) => {
    try{
        const brands = await brandModel.aggregate([
            {
                $match: {
                    deleteAt: null,
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

        if(!brands){
            return res.status(422).json({ message: 'No brands found'});
        }

        return res.status(200).json(
            {
                message: 'fetched brands',
                data: brands,
           
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
                    deleteAt: null,
                    },
                },{

                $project: {
                    name: 1,
                    _id: 1,
                    image: 1,
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

        const { brand } = req.body;

        let brandimage = req.body.imageFile;
                if (req.files) {
                    req.files.forEach((file) => {
                        if (file.fieldname == 'imageFile') {
                            brandimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                        }
                    });
    
                    }

        if (!brand) {
            return res.status(422).json({ message: 'brand name is required' });
        }

        const existingData = await brandModel.findOne({ name: brand, _id: {$ne: brandId}, });

        if (existingData) {
            return res.status(422).json({ message: 'brand name already exist' });
        }

        const brands = await brandModel.findOne({
            _id: brandId,
            deleteAt: null,
        });

        brands.name = brand;
        brands.image= brandimage;

        await brands.save();

        return res.status(200).json({
            message: 'Updated Successfully',
            success:true
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

        brand.deleteAt = new Date();

        await brand.save();

        return res.status(200).json({
            message: 'Deleted Successfully',
            success:true
        });
    
    } catch (err) {
        console.log(err);
        next(serverError());
    }
};