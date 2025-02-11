// import express from 'express';
import { AuthModel } from '../../models/AuthModel.js';
import { serverError } from '../../utils/ErrorHandler.js';
import env from '../../../env.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signUp = async (req,res,next) => {
    try {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(env.ADMIN_PASSWORD, salt);

        await AuthModel.create({
            email:env.ADMIN_EMAIL,
            password:hash,
        });

       return res.status(200).send('user has been created');

    }
    catch (err) {
        console.log(err);
        next(serverError());
    }
};
export const login = async (req,res,next) => {
    try {
        const {email,password} = req.body;
// console.log(email);
        const user = await AuthModel.findOne({email: email});

        if(!user){
            return res.status(422).send('user not found');
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if(!isPasswordValid){
            return res.status(422).send('invalid password');
            }
        
        const accessToken = jwt.sign({adminId: user._id},env.JWT_SECRET_KEY,{
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