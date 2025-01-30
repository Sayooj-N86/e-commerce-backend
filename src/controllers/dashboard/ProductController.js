import mongoose from 'mongoose';
import { serverError } from '../../utils/ErrorHandler.js';
import { productModel } from '../../models/ProductModel.js';
import path from 'path';



export const createProduct = async(req,res,next) => {
    try{
        const { productname ,productdescription,productprize } = req.body;
        
        let productimage;
                
                        req.files?.forEach((file) => {
                            if (file.fieldname == 'image') {
                                productimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                            }
                        });
        if(!productname){
            return res.status(422).json({ message: 'product name is required' });
        }

        const existingData =await productModel.findOne({name:productname});
        
        if(existingData){
            return res.status(422).json({message:'product already exists'});
        }


        await productModel.create({
            name: productname,
            price: productprize,
            description: productdescription,
            image: productimage,
        });
        return res.status(200).json({ message: 'product created'});
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
                    price: 1,
                    description: 1,
                    image: 1,
                }
            }
        ]);

        if(!product){
            return res.status(422).json({ message: 'No products found'});
        }

        return res.status(200).json(
            {
                message: 'fetched products',
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
            message: 'fetched product',
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

        let productimage = req.body.image;
                if (req.files) {
                    req.files.forEach((file) => {
                        if (file.fieldname == 'image') {
                          productimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                        }
                    });
                    }

        if (!productname) {
            return res.status(422).json({ message: 'product name is required' });
        }

        const existingData = await productModel.findOne({ name: productname, _id: {$ne: productId}, });

        if (existingData) {
            return res.status(422).json({ message: 'product name already exist' });
        }

        const product = await productModel.findOne({
            _id: productId,
            deletedAt: null,
        });

        product.name = productname;
        product.image = productimage;

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