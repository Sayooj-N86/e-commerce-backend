import mongoose from 'mongoose';
import { bannerModel } from '../../models/BannerModel.js';
import { serverError } from '../../utils/ErrorHandler.js';
import path from 'path';
import { categoryModel } from '../../models/CategoryModel.js';


export const createBanner = async (req, res, next) => {
	try {
		const { banner, category } = req.body;
        let bannerimage;
                
            req.files.forEach((file) => {
                if (file.fieldname == 'imageFile') {
                    bannerimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                }
            });

		// if (!banner) {
		// 	return res.status(422).json({ message: 'banner name is required' });
		// }

		// const existingData = await bannerModel.findOne({ name: banner ,deleteAt:null});

		// if (existingData) {
		// 	return res.status(422).json({ message: 'banner already exists' });
		// }

		await bannerModel.create({
			name: banner,
			category: category,
            image: bannerimage
		});
		return res.status(200).json({ message: 'banner created',success:true });
	} catch (err) {
		console.log(err);
		next(serverError());
	}
};

export const getAllBanner = async (req, res, next) => {
	try {
		const banners = await bannerModel.aggregate([
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
				},
			},
			{
				$project: {
					// name: 1,
					_id: 1,
                    image: 1,
					category: '$categories.name',
				},
			},
		]);
console.log(banners);
		if (!banners) {
			return res.status(422).json({ message: 'No banners found' });
		}

		return res.status(200).json({
			message: 'fetched banners',
			data: banners,
		});
	} catch (err) {
		next(serverError());
	}
};

export const getBannerById = async (req, res, next) => {
	try {
		const bannerId = req.params.id;
		const banner = (
			await bannerModel.aggregate([
				{
					$match: {
						_id: new mongoose.Types.ObjectId(bannerId),
						deleteAt: null,
					},
				},
				{
					$project: {
						name: 1,
						_id: 1,
						image:1,
						category: 1,
					},
				},
			])
		).at(0);
		return res.status(200).json({
			message: 'fetched banner',
			data: banner,
		});
	} catch (err) {
		console.log(err);
		next(serverError());
	}
};

export const updateBanner = async (req, res, next) => {
	try {
		const bannerId = req.params.id;

		const { banner } = req.body;
        let bannerimage = req.body.imageFile;
                        if (req.files) {
                            req.files.forEach((file) => {
                                if (file.fieldname == 'imageFile') {
                                    bannerimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                                }
                            });
                
                            }
        

		if (!banner) {
			return res.status(422).json({ message: 'banner name is required' });
		}

		const existingData = await bannerModel.findOne({ name: banner, _id: { $ne: bannerId } });

		if (existingData) {
			return res.status(422).json({ message: 'banner name already exist' });
		}

		const banners = await bannerModel.findOne({
			_id: bannerId,
			deleteAt: null,
		});

		banners.name = banner;
        banners.image = bannerimage;

		await banners.save();

		return res.status(200).json({
			message: 'Updated Successfully',
			success:true
		});
	} catch (err) {
		console.log(err);
		next(serverError());
	}
};

export const deleteBanner = async (req, res, next) => {
	try {
		const bannerId = req.params.id;

		//await CategoryModel.deleteOne({_id:categoryId})

		const banner = await bannerModel.findOne({
			_id: bannerId,
		});

		banner.deleteAt = new Date();

		await banner.save();

		return res.status(200).json({
			message: 'Deleted Successfully',
			success:true
		});
	} catch (err) {
		console.log(err);
		next(serverError());
	}
};
