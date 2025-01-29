import mongoose from 'mongoose';
import { serverError } from '../../utils/ErrorHandler.js';
import { productModel } from '../../models/Productodel.js';


export const createProduct = async(req,res,next) => {
    try{
        const { productname } = req.body;
        
        if(!productname){
            return res.status(422).json({ message: 'category name is required' });
        }

        const existingData =await productModel.findOne({name:productname});
        
        if(existingData){
            return res.status(422).json({message:'Category already exists'});
        }


        await productModel.create({
            name: productname,
        });
        return res.status(200).json({ message: 'category created'});
    }
    catch (err){
        console.log(err);
        next(serverError());
    }
};

export const getAllProduct = async (req,res,next) => {
    try{
        const product = await productModel.aggregate([
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

        if(!product){
            return res.status(422).json({ message: 'No categories found'});
        }

        return res.status(200).json(
            {
                message: 'fetched categories',
                data: product,
            }
        );
    }
    catch (err){
        next(serverError());
        }
};

export const getProductById = async(req,res,next) => {
    try{
        const productId = req.params.id;
        const product = (await productModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(productId),
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
            data: product,
        });
    }
    catch (err){
        console.log(err);
        next(serverError());
        }
};

export const updateProduct = async (req, res, next) => {

    try {

        const productId = req.params.id;

        const { productname } = req.body;

        if (!productname) {
            return res.status(422).json({ message: 'Category name is required' });
        }

        const existingData = await productModel.findOne({ name: productname, _id: {$ne: productId}, });

        if (existingData) {
            return res.status(422).json({ message: 'Category name already exist' });
        }

        const product = await productModel.findOne({
            _id: productId,
            deletedAt: null,
        });

        product.name = productname;

        await product.save();

        return res.status(200).json({
            message: 'Updated Successfully',
        });
    
    } catch (err) {
        console.log(err);
        next(serverError());
    }
};

export const deleteProduct = async (req, res, next) => {

    try {

        const productId = req.params.id;

        //await CategoryModel.deleteOne({_id:categoryId})

        const product = await productModel.findOne({
            _id: productId,
        });

        product.deletedAt = new Date();

        await product.save();

        return res.status(200).json({
            message: 'Deleted Successfully',
        });
    
    } catch (err) {
        console.log(err);
        next(serverError());
    }
};