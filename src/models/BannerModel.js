import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:false,
        },
        image: {
            type: String,
            required:false,
        },
        category: {
            type: mongoose.Types.ObjectId,
            required:false,
        },
        
        deleteAt: {
            type: String,
            required: false,
            default: null,
        },
    },
    {timestamps: true}
);
export const bannerModel = mongoose.model('banners',bannerSchema);