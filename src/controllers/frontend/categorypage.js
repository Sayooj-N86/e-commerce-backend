import { categoryModel } from '../../models/CategoryModel.js';
import { serverError } from '../../utils/ErrorHandler.js';


export const getAllCategories = async (req,res,next) => {
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