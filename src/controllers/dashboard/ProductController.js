import mongoose from 'mongoose';
import path from 'path';
import { brandModel } from '../../models/BrandModel.js';
import { categoryModel } from '../../models/CategoryModel.js';
import { productModel } from '../../models/ProductModel.js';
import { serverError } from '../../utils/ErrorHandler.js';



export const createProduct = async(req,res,next) => {
    try{
        const { product ,description ,price ,category ,brand } = req.body;
        
        let productimage;
                
                        req.files?.forEach((file) => {
                            if (file.fieldname == 'imageFile') {
                                productimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                            }
                        });
        // if(!product){
        //     return res.status(422).json({ message: 'product name is required' });
        // }

        // const existingData =await productModel.findOne({name:product});
        
        // if(existingData){
        //     return res.status(422).json({message:'product already exists'});
        // }


        await productModel.create({
            name: product,
            price: price,
            description: description,
            image: productimage,
            category: category,
            brand: brand
        });
        return res.status(200).json({ message: 'product created',success:true});
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
                    deleteAt: null,
                },
            },
            {
                            $lookup: {
                                from: categoryModel.modelName,
                                localField: 'category',
                                foreignField: '_id',
                                as: 'categories',
                                pipeline:[
                                    {
                                        $project:{
                                            _id:0,
                                            name:1
                                        }
                                        }
                                ]
                                },
                        },
                        {
                            $unwind:{
                                path:'$categories',
                                preserveNullAndEmptyArrays:true
                            },
                        },
            {
                            $lookup: {
                                from: brandModel.modelName,
                                localField: 'brand',
                                foreignField: '_id',
                                as: 'brands',
                                pipeline:[
                                    {
                                        $project:{
                                            _id:0,
                                            name:1
                                        }
                                        }
                                ]
                                },
                        },
                        {
                            $unwind:{
                                path:'$brands',
                                preserveNullAndEmptyArrays:true
                            },
                        },
            {
                $project: {
                    name: 1,
                    _id: 1,
                    price: 1,
                    description: 1,
                    image: 1,
                    brand: '$brands.name',
                    category:'$categories.name'
                }
            }
        ]);
console.log(product);
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
                    deleteAt: null,
                    },
                },{

                $project: {
                    name: 1,
                    _id: 1,
                    price: 1,
                    description: 1,
                    image: 1,
                    brand: 1,
                    category:1
                    
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

        const { product,price,description } = req.body;

        let productimage = req.body.imageFile;
                if (req.files) {
                    req.files.forEach((file) => {
                        if (file.fieldname == 'imagefile') {
                          productimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                        }
                    });
                    }

        // if (!product) {
        //     return res.status(422).json({ message: 'product name is required' });
        // }

        // const existingData = await productModel.findOne({ name: product, _id: {$ne: productId}, });

        // if (existingData) {
        //     return res.status(422).json({ message: 'product name already exist' });
        // }

        const products = await productModel.findOne({
            _id: productId,
            deleteAt: null,
        });

        products.name = product;
        products.description = description;
        products.price = price;
        products.image = productimage;

        await products.save();

        return res.status(200).json({
            message: 'Updated Successfully',
            success:true
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

        product.deleteAt = new Date();

        await product.save();

        return res.status(200).json({
            message: 'Deleted Successfully',
            success:true
        });
    
    } catch (err) {
        console.log(err);
        next(serverError());
    }
};