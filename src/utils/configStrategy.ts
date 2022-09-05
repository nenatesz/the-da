import { Request, Response, NextFunction } from "express";
import passport from 'passport';
import LocalStrategy from 'passport-local';
import passportCustom from 'passport-custom';
import linkedInStrategy, {StrategyOption, StrategyOptionWithRequest} from 'passport-linkedin-oauth2';
import bcrypt from 'bcrypt';
import JwtStrategy, { StrategyOptions } from 'passport-jwt';
import ExtractJwt from 'passport-jwt';
import UserModel, { IUserDocument } from '../models/user.model';
import config from "../config";
import { constants } from 'buffer';
import handler from "./handlers";


const CustomStrategy = passportCustom.Strategy;
const LinkedInStrategy = linkedInStrategy.Strategy;

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
                role              
            } = req.body;
            
            UserModel.create({
                email,
                password: bcrypt.hashSync(password, 10),
                username,
                role
            }, (err, user) => {
                if (err) {
                    console.log('errr', err)
                    return done(err, false);
                }
                return done(null, user);
            })
        }catch(error){
            console.log('errorrrr', error);
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
            console.log(email, password);
            let user: IUserDocument | null = await UserModel.findOne({email});
            console.log('email', email);

            if(!user){
             return done(false, null, { message: "Invalid Login Details" });
            }

            const isValidPassword = await bcrypt.compare(password, <string>user.password);
    
            if(!isValidPassword){
                return done(false, null, { message: "Invalid Login Details" });
            }
            user.password = "null";
            
            console.log(user);
            return done(null, user);
        
        } catch (error){
            console.log(error);
            return done(error, null)
        }       
    }
));

// const cookieExtractor = function(req: Request) {
//     console.log('acess-TOKEN!!!')
//     let token = null;
//     if (req && req.cookies)
//     {
//         token = req.cookies['jwt'];
//         console.log('token!', token)
//     }
//     return token;
// };

// JWT STRATEGY TO VERIFY TOKEN SENT BY REQUESTS
const jwtOpts: StrategyOptions = {
    // jwtFromRequest: ExtractJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtFromRequest: ExtractJwt.ExtractJwt.fromExtractors([ExtractJwt.ExtractJwt.fromAuthHeaderAsBearerToken(), handler.cookieExtractor]),
    // jwtFromRequest: cookieExtractor,
    secretOrKey: config.jwt_secret,
};
// token in this callback function is the decoded jwt token
passport.use(new JwtStrategy.Strategy(jwtOpts, async (token, done) => {
    try{
        if(token) {
            console.log('token', token)
            const {id, email, role, username} = token;
            console.log('token', token.iat);
            const iat: string = (token.iat).toString();
            console.log('stringToken', iat);
    
            const user: IUserDocument |  null = await UserModel.findOne({email, username});
            if(!user){
                return done(null, false, {errors: {message: "User Not Authorized"}});
            }
            // try {
            console.log('user', user)
            return done(null, user);
            //   } catch (error) {
                // done(error);
            //   }
            
        }
    }catch(error){
        console.log(error);
        return done(error, null);
    }
}));


// STRATEGY TO AUTHENTICATE USER WITH LINKEDIN
const linkedinOpts: StrategyOptionWithRequest = {
    clientID: config.linkedInClientId,
    clientSecret: config.linkedInClientSecret,
    callbackURL: process.env.NODE_ENV === 'development' ? 'http://localhost:5050/auth/linkedin/callback' : 'https://clink-ng.herokuapp.com/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile'],
    passReqToCallback: true
}

passport.use(new LinkedInStrategy(linkedinOpts, (req: Request, accessToken, refreshToken, profile, done) => {
    // (req: Request) => {
        process.nextTick(() => {
            try {
                console.log('accessToken', accessToken)
                console.log('env', process.env.NODE_ENV)
                if (!profile?.emails[0].value){
                    done(null, false, 'LinkedIn Account is not registered with email. Please sign in using other methods');
                }
                    console.log('profile.emails', profile.emails)
                    console.log('profile', profile);
                    UserModel.findOne({email: profile.emails[0].value}, (err: any, user: IUserDocument | null) => {
                        if(err){
                            console.log('An error occured', err)
                        }
                        if (user?.email || user?.providerUserId) {
                            // return done (null, false, 'User Already Exists Please Login')
                            console.log('hasEmail and Username')
                            try {
                                return done(null, user)
                            }catch(err){
                                console.log(err)
                            }
                        } else {
                            console.log('has No Email')
                            UserModel.create({
                                email: profile.emails[0].value,
                                fullname: profile.name.givenName + ' ' + profile.name.familyName,
                                provider: 'linkedin',
                                providerUserId: profile.id,
                                providerImageUrl: profile.photos[0].value
                            },
                                (err, user) => {
                                    if(err){
                                        return done(err, null)
                                    }
                                    console.log('here', user);
                                    return done(null, user)
                                })                              
                        }                          
                    })  
                    // return done(null, profile)
            }catch(error) {
                console.log('error', error)
                return done(error, null, 'Authentication failed')
            }
     })

    // }
    
}))
