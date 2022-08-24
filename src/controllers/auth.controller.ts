import express from "express";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt, { JwtPayload } from "jsonwebtoken";
import "../utils/configStrategy";
import config from "../config";
import UserModel, { IUserDocument, IUserModel } from "../models/user.model";
import Handler from "../utils/handlers";



const handler = new Handler();

// AUTHENTICATE REQUESTS FUNCTION

const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("register", { session: false }, (err, user, info) => {
        if (err || !user) {
          console.log('error', err);
          return handler.send(res, 'This email or username already exists', err.status || 400, 'error');
        }
        user.password = undefined;
        console.log('user', user)
        return handler.send(res, 'User successfully created!', 200, 'success', user);
        // return res.json({
        //   status: 'success',
        //   message: 'User successfully created!',
        //   data: user,
        // });
      })(req, res, next);
}

// LOGIN USER
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("login", {session: false}, async (err, user, info) => {
      console.log('err', err)
      console.log('info', info)

      if (err || !user) {
        console.log('login', info.message)
        return handler.send(res, info.message, 401, 'error')
      }
      user.password = undefined; 
      console.log('password', user.password);
      const token = jwt.sign({ email: user.email, role: user.role, username: user.username }, <string>config.jwt_secret, { expiresIn: "10d" });
      console.log('token', token);
      const decoded: any = jwt.verify(token, <string>config.jwt_secret);
      // const iat = decoded.email;
      console.log('decoded', decoded.role)
      console.log('user', user.email)

      await UserModel.findOneAndUpdate({email: user.email}, {iat: (decoded.iat).toString()});
      return handler.send(res, 'user successfully logged in', 200, 'success', token)
    })(req, res, next)
}

// AUTHENTICATE REQUESTS
const isAuthUser = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false })(req, res, next);
};


// CHECK IF USER IS AN ADMIN
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {    
  if(req.user && (<any>req.user).role === 'admin'){
    next();
  }else{
    return handler.send(res, 'Admin Token is not valid', 401, 'error');
  } 
}

// CHECK IF USER HAS COMPLETED 
const completeUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const {email, username} = <any>req.user;

  const userDetails = await UserModel.findOne({email, username});
  if(!userDetails){
    return handler.send(res, 'User not found!', 401, 'error');
  }

  const socialHandles = userDetails?.linkedin || userDetails?.instagram || userDetails?.facebook || userDetails?.twitter || userDetails?.snapchat
  console.log('userDetails, userDetails');
  if (userDetails?.role === 'customer' && (socialHandles) && userDetails?.quote && userDetails?.profile_picture && userDetails?.profile_video) {
    next()
  } else {
    return handler.send(res, 'You have to complete your profile to view this page', 401, 'error');
    // res.status(401).send({msg: 'You have to complete your profile to view this page'});
  }
}



export default {
  userLogin, userRegister, isAdmin, completeUserProfile, isAuthUser
}