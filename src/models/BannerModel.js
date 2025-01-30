import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
        },
        image: {
            type: String,
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