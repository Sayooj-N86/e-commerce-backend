import mongoose from 'mongoose';

const AuthSchema = new mongoose.Schema(
    {
        email: {
            type:String,
            required:true,
        },
        password: {
            type: String,
            required:false,
        },
        deleteAt: {
            type: Date,
            required: false,
            default: null,
        },
    },
    {timestamps: true}
);
export const AuthModel = mongoose.model('admins',AuthSchema);