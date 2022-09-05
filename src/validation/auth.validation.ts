import { body, CustomValidator, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from "express";
import UserModel from '../models/user.model';


const validateRegistration = () => [
    body('email').notEmpty().bail().isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({min: 8}).isAlphanumeric(),
    body('username').notEmpty(),
    validate
]

const validateLogin = () => [
    body('email').notEmpty().bail().isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({min: 8}),
    validate
]

const validateBioSetup = () => [
    // gender, sexuality, dob, occupation, quote, profile_picture, instagram, twitter, linkedin, facebook, snapchat
    body('gender').notEmpty().isString(),
    body('sexuality').notEmpty().isString(),
    body('dob').notEmpty().isDate(),
    body('occupation').notEmpty().isString(),
    body('quote').notEmpty().isString().isLength({min: 8}),
    validate
]

// const isValidUsername: CustomValidator = async (value, req: Request) => {
//     const username = await UserModel.exists({username: value});
//     if (username) {
//         console.log('This Username already exists')
//         return Promise.reject('This Username already exists')
//     }
//     // req.username = req.body.username
//     req.username = 'tessa'
// }
// const validateUsernameExists = () => [
//     // body('username').notEmpty().custom(isValidUsername),
//     body('username').custom(isValidUsername),
//     validate
// ];

const validate = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        errors.array().map((err: {param: string}) => {
            if (err.param.includes('email')) {
                return next({message: 'Ensure your email adress is correct', statusCode: 400, status: 'error'})             
            }
            if (err.param.includes('password')) {
                return next({message: 'Ensure your password length is greater than 8', statusCode: 400, status: 'error'})
            }
            if (err.param.includes('username')) {
                return next({message: 'Provide your username', statusCode: 400, status: 'error'})
            }
            if (err.param.includes('gender')) {
                return next({message: 'Gender field cannot be empty', statusCode: 400, status: 'error'})
            }
            if (err.param.includes('sexuality')) {
                return next({message: 'Sexuality field cannot be empty', statusCode: 400, status: 'error'})
            }
            if (err.param.includes('dob')) {
                return next({message: 'dob field cannot be empty', statusCode: 400, status: 'error'})
            }
            if (err.param.includes('occupation')) {
                return next({message: 'occupation field cannot be empty', statusCode: 400, status: 'error'})
            }
            if (err.param.includes('quote')) {
                return next({message: 'quote field cannot be empty', statusCode: 400, status: 'error'})
            }
        });

    }catch(error){
        console.log('errors', error)
    }
};




const authValidation = {
    validateRegistration, validateLogin, validateBioSetup, 
}
export default authValidation;