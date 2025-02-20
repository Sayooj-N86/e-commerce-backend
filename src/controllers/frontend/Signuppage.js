import env from '../../../env.js';
import { UserModel } from '../../models/UserModel.js';
import { serverError } from '../../utils/ErrorHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const signup = async (req, res, next) =>
{
    try
    {
    const { name, email, password,confirmpassword}= req.body;

    const existingData = await UserModel.findOne({email:email,deleteAt:null});

    if(existingData){
        return res.status(422).json({message:'user already existed'});
    }
    if(password !== confirmpassword){
        return res.status(422).json({message:'password and confirm password does not match'});
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await UserModel.create({
        name:name,
        email:email,
        password:hash,
        
    });
    res.status(201).json({message:'user created successfully',success:true});

    }
    catch (error){
        next(serverError());
    }
};

export const login = async (req,res,next) => {
    try {
        const {email,password} = req.body;
// console.log(email);
        const user = await UserModel.findOne({email: email});

        if(!user){
            return res.status(422).send('user not found');
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if(!isPasswordValid){
            return res.status(422).send('invalid password');
            }
        
        const accessToken = jwt.sign({adminId: user._id},env.USER_JWT_SECRET_KEY,{
            expiresIn: env.JWT_EXPIRES,
        });

        const userData = {email: user.email};
        return res.status(200).send({
            success:true,
            accessToken,
            userData
        });
    }
    catch (err) {
        next(serverError());
    }
};