import mongoose from 'mongoose';
import { bannerModel } from '../../models/BannerModel.js';
import { serverError } from '../../utils/ErrorHandler.js';
import path from 'path';


export const createBanner = async (req, res, next) => {
	try {
		const { bannername, categoryname } = req.body;
        let bannerimage;
                
            req.files.forEach((file) => {
                if (file.fieldname == 'image') {
                    bannerimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                }
            });

		if (!bannername) {
			return res.status(422).json({ message: 'banner name is required' });
		}

		const existingData = await bannerModel.findOne({ name: bannername });

		if (existingData) {
			return res.status(422).json({ message: 'banner already exists' });
		}

		await bannerModel.create({
			name: bannername,
			category: categoryname,
            image: bannerimage
		});
		return res.status(200).json({ message: 'banner created' });
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
				$project: {
					name: 1,
					_id: 1,
					category: 1,
                    image: 1,
				},
			},
		]);

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

		const { bannername } = req.body;
        let bannerimage = req.body.image;
                        if (req.files) {
                            req.files.forEach((file) => {
                                if (file.fieldname == 'image') {
                                    bannerimage =  'uploads' + file.path.split(path.sep + 'uploads').at(1);
                                }
                            });
                
                            }
        

		if (!bannername) {
			return res.status(422).json({ message: 'banner name is required' });
		}

		const existingData = await bannerModel.findOne({ name: bannername, _id: { $ne: bannerId } });

		if (existingData) {
			return res.status(422).json({ message: 'banner name already exist' });
		}

		const banner = await bannerModel.findOne({
			_id: bannerId,
			deleteAt: null,
		});

		banner.name = bannername;
        banner.image = bannerimage;

		await banner.save();

		return res.status(200).json({
			message: 'Updated Successfully',
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
		});
	} catch (err) {
		console.log(err);
		next(serverError());
	}
};
