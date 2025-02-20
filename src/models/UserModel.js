import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
            },
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
export const UserModel = mongoose.model('users',UserSchema);