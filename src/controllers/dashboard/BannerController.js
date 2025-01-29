import mongoose from 'mongoose';
import { categoryModel } from '../../models/CategoryModel.js';
import { serverError } from '../../utils/ErrorHandler.js';

export const createCategory = async(req,res,next) => {
    try{
        const { categoryname } = req.body;
        
        if(!categoryname){
            return res.status(422).json({ message: 'category name is required' });
        }

        const existingData =await categoryModel.findOne({name:categoryname});
        
        if(existingData){
            return res.status(422).json({message:'Category already exists'});
        }


        await categoryModel.create({
            name: categoryname,
        });
        return res.status(200).json({ message: 'category created'});
    }
    catch (err){
        console.log(err);
        next(serverError());
    }
};

export const getAllCategory = async (req,res,next) => {
    try{
        const categories = await categoryModel.aggregate([
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

        if(!categories){
            return res.status(422).json({ message: 'No categories found'});
        }

        return res.status(200).json(
            {
                message: 'fetched categories',
                data: categories,
            }
        );
    }
    catch (err){
        next(serverError());
        }
};

export const getCategoryById = async(req,res,next) => {
    try{
        const categoryId = req.params.id;
        const category = (await categoryModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(categoryId),
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
            data: category,
        });
    }
    catch (err){
        console.log(err);
        next(serverError());
        }
};

export const updateCategory = async (req, res, next) => {

    try {

        const categoryId = req.params.id;

        const { categoryname } = req.body;

        if (!categoryname) {
            return res.status(422).json({ message: 'Category name is required' });
        }

        const existingData = await categoryModel.findOne({ name: categoryname, _id: {$ne: categoryId}, });

        if (existingData) {
            return res.status(422).json({ message: 'Category name already exist' });
        }

        const category = await categoryModel.findOne({
            _id: categoryId,
            deletedAt: null,
        });

        category.name = categoryname;

        await category.save();

        return res.status(200).json({
            message: 'Updated Successfully',
        });
    
    } catch (err) {
        console.log(err);
        next(serverError());
    }
};

export const deleteCategory = async (req, res, next) => {

    try {

        const categoryId = req.params.id;

        //await CategoryModel.deleteOne({_id:categoryId})

        const category = await categoryModel.findOne({
            _id: categoryId,
        });

        category.deletedAt = new Date();

        await category.save();

        return res.status(200).json({
            message: 'Deleted Successfully',
        });
    
    } catch (err) {
        console.log(err);
        next(serverError());
    }
};