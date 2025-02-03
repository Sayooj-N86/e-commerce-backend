import mongoose from 'mongoose';
import path from 'path';
import { categoryModel } from '../../models/CategoryModel.js';
import { serverError } from '../../utils/ErrorHandler.js';

export const createCategory = async(req,res,next) => {
    try{
        const { category } = req.body;

        let image;

		req.files.forEach((file) => {
			if (file.fieldname == 'imageFile') {
				image =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
			}
		});

        // const image = getFilePath(req.file);
        
        if(!category){
            return res.status(422).json({ message: 'category name is required' });
        }

        const existingData =await categoryModel.findOne({name:category,deleteAt:null});
        
        if(existingData){
            return res.status(422).json({message:'Category already exists'});
        }


        await categoryModel.create({
            name: category,
            image: image,
        });
        return res.status(200).json({ message: 'category created',success:true});
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
                    deleteAt: null,
                    },
                },{

                $project: {
                    name: 1,
                    _id: 1,
                    image:1
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

		const { category } = req.body;

		if (!category) {
			return res.status(422).json({ message: 'Category name is required' });
		}

        let image = req.body.imageFile;
        if (req.files) {
            req.files.forEach((file) => {
                if (file.fieldname == 'imageFile') {
                    image =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                }
            });
            }

        const existingData = await categoryModel.findOne({ name: category, _id: {$ne: categoryId}, });

		if (existingData) {
			return res.status(422).json({ message: 'Category name already exist' });
		}

		const categories = await categoryModel.findOne({
			_id: categoryId,
			deletedAt: null,
		});

		categories.name = category;
        categories.image = image;

		await categories.save();

		return res.status(200).json({
			message: 'Updated Successfully',
            success:true
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

		category.deleteAt = new Date();

		await category.save();

		return res.status(200).json({
			message: 'Deleted Successfully',
            success:true
		});
    
	} catch (err) {
		console.log(err);
		next(serverError());
	}
};