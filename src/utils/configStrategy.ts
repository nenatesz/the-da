import { Request, Response, NextFunction } from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import passportCustom from "passport-custom";
import bcrypt from "bcrypt";
import JwtStrategy, { StrategyOptions } from "passport-jwt";
import ExtractJwt from "passport-jwt";
import UserModel from "../models/user.model";
import config from "../config";


const CustomStrategy = passportCustom.Strategy;

// CONFIGURE  ALL STRATEGIES

// CREATE USERS ACCOUNT USING PASSPORT CUSTOM STRATEGY
passport.use("register", new CustomStrategy(
    async (req: Request, done) => {
        try{
            console.log('req', req.body)
            const {
                email,
                password,
                username,
                gender,
                sexuality,
                dob,
                occupation,  
                role              
            } = req.body;
            
            UserModel.create({
                email,
                password: bcrypt.hashSync(password, 10),
                username,
                gender,
                sexuality,
                dob,
                occupation,
                role
            }, (err, user) => {
                if (err) {
                    console.log('errr', err)
                    return done(err, false);
                }
                return done(null, user);
            })
        }catch(error){
            console.log(error);
            return done(error, null)
        }
}));


// LOGIN USERS USING PASSPORT CUSTOM STRATEGY
passport.use("login", new LocalStrategy.Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
},
    async (req, email, password, done) => {
        try{
            // const {email, password} = req.body
            console.log(email, password);
            let user = await UserModel.findOne({email});
            console.log('email', email);
            if(!user){
                return done(false, null, { message: "Invalid Login Details" });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
    
            if(!isValidPassword){
                return done(false, null, { message: "Invalid Login Details" });
            }
            user.password = "null";
            
            console.log(user);
            return done(null, user);
        }catch(error){
            console.log(error);
            return done(error, null)
        }       
    }
));


// JWT STRATEGY TO VERIFY TOKEN SENT BY REQUESTS
const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt_secret
};
// token in this callback function is the decoded jwt token
passport.use(new JwtStrategy.Strategy(opts, async (token, done) => {
    try{
        const {id, email} = token;
        console.log('token', token.iat);
        const iat = (token.iat).toString();
        console.log('stringToken', iat);

        const user = await UserModel.findOne({email, iat});
        if(!user){
            return done(null, false, {errors: {message: "User Not Authorized"}});
        }
        // try {
        console.log(user)
        return done(null, user);
        //   } catch (error) {
            // done(error);
        //   }
    }catch(error){
        console.log(error);
        return done(error, null);
    }
}));

// STRATEGY TO AUTHENTICATE USER WITH LINKEDIN

