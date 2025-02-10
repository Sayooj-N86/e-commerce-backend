import { bannerModel } from '../../models/BannerModel.js';
import { categoryModel } from '../../models/CategoryModel.js';
import { productModel } from '../../models/ProductModel.js';
import { serverError } from '../../utils/ErrorHandler.js';


export const homepageData = async (req, res, next) => {
    try {
        const banners = await bannerModel.aggregate([
            {
                $match: {
                    deleteAt: null,
                },
            },
            
            {
                $project: {
                    // name: 1,
                    _id: 1,
                    image: 1,
                    category:1,
                },
            },
        ]);
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
         const featuredProduct = await productModel.aggregate([
                    {
                        $match: {
                            deleteAt: null,
                            featured:true
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
                            featured:1
                        }
                    }
                ]);
console.log(banners);
       

        return res.status(200).json({
            message: 'fetched banners',
            data:{banners: banners,categories:categories,featuredproduct:featuredProduct} ,
        });
    } catch (err) {
        next(serverError());
    }
};

    
        
