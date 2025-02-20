import mongoose from 'mongoose';
import { productModel } from '../../models/ProductModel.js';
import { serverError } from '../../utils/ErrorHandler.js';
import { categoryModel } from '../../models/CategoryModel.js';
import { brandModel } from '../../models/BrandModel.js';


export const getAllProducts = async (req,res,next) => {
    try{
        const categoryId = req.params.id;
        console.log(categoryId);
        const product = await productModel.aggregate([
            {
                $match: {
                    deleteAt: null,
                    category: new mongoose.Types.ObjectId(categoryId)

                },
            },
            
            {
                $project: {
                    name: 1,
                    _id: 1,
                    price: 1,
                    description: 1,
                    image: 1,
                    // brand: '$brands.name',
                    // category:'$categories.name',
                    // featured:1
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

export const getOneProductById = async(req,res,next) => {
    try{
        const productId = req.params.id;
        console.log(productId);
        const product = (await productModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(productId),
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
               
                    price: 1,
                    description: 1,
                    image: 1,
                    category: '$categories.name',
                    brand:'$brands.name'
                    
                    }
                }
        ])).at(0);
        console.log(product);
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