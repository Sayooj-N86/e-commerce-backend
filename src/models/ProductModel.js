import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
        },
        price: {
            type:Number,
            required:false,
        },
        description: {
            type:String,
            required:false,
            },
        category: {
                type: mongoose.Types.ObjectId,
                required:false,
            },
        brand: {
                type: mongoose.Types.ObjectId,
                required:false,
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
export const productModel = mongoose.model('products',productSchema);