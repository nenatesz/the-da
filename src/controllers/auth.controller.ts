import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import '../utils/configStrategy';
import UserModel, { IUserDocument, IUserModel } from '../models/user.model';
import handler from '../utils/handlers';
// import nodemailer from 'nodemailer';

declare global {
  namespace Express {
    interface User extends IUserDocument {
      email?: string;
      role?: string;
    }
  }
}

// AUTHENTICATE REQUESTS FUNCTION

// REGISTER USER
const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("register", { session: false }, (err, user, info) => {
        if (err || !user) {
          console.log('error', err);
          return handler.send(res, 'This email or username already exists', err.status || 400, 'error');
        }
        user.password = undefined;

        console.log('user', user)
        const token = handler.generateToken({ email: user.email, role: user.role, username: user.username})
        console.log('token', token);
        return handler.send(res, 'User successfully created!', 200, 'success', {token, user});
      })(req, res, next);
}

// 
// LOGIN USER
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("login", {session: false}, async (err, user, info) => {
      try{
        console.log('err', err)
        console.log('info', info)
  
        if (err || !user) {
          console.log('login', info.message)
          return handler.send(res, info.message, 401, 'error')
        }
        user.password = undefined; 
        console.log('password', user.password);
        const token = handler.generateToken({ email: user.email, role: user.role, username: user.username})
        console.log('token', token);
        const decoded = handler.verifyToken(token)
        console.log('decoded', decoded.role)
        if (decoded.iat !== undefined){
          await UserModel.findOneAndUpdate({email: user.email}, {iat: (decoded.iat).toString()});
        }
        return handler.send(res, 'user successfully logged in', 200, 'success', {token, user})
      }catch(err){
        console.log(err)
      }
    })(req, res, next)
};
// AUTHENTICATE USER WITH LINKEDIN
const linkedinAuth = (req: Request, res: Response, next: NextFunction ) => {
   return passport.authenticate('linkedin', {state: 'SOME STATE'})(req, res, next);
}
// LINKEDIN CALLBACK - The app is redirected here with an authentication code after successful authentication. 
const linkedinCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("linkedin", { session: false}, (err, user, info) => {
    console.log('user', user)
    if (err || !user) {
      console.log('err authenticating user')
      return res.json({data: 'Error Authenticating User'}).end()
    }
    if (!user?.username) {
      // redirect to the username page, for the user to add a username. remove placeholder when url to the username page is provided.
      return res.redirect(302, 'http://localhost:8080/users/username');
      
    }
    req.login(user, {session: false}, err => {
      if(err) {
        res.status(400).send({ err });
      }
      console.log('username', user.username)
      const token = handler.generateToken({ email: user.email, role: user.role, username: user.username});
      console.log('token', token)
      res.cookie('jwt', token);
     
      res.redirect(301, 'http://localhost:8080/users/');
    })

  })(req, res, next)
};

// IF USER TRYS TO AUTHENTICATE WITH LINKEDIN AMD DOESN'T HAVE A USERNAME IN THE DB, THEY ARE REDIRECTED TO THIS ROUTE WHERE THEY INPUT THIER USERNAME AND ARE THEN AUTHENTICATED(IE GENERATE A VALID TOKEN)
const usernameInput = async (req: Request, res: Response, next: NextFunction) => {
  // The user shouldn't be the one to input the email addres, should be in the request object though
  const { username, email, role } = req.body;
  if (!username) {
    return handler.send(res, 'Please input a valid username', 400, 'error')
  }
  const userExists = await UserModel.exists({username});
  if (userExists) {
      return handler.send(res, 'This Username already exists', 400, 'error')
  }
  const usernameUpdate = await UserModel.findOneAndUpdate({email, role}, {username}, {new: true});
  if (!usernameUpdate){
    return handler.send(res, 'Error saving username', 400, 'error')
  }
  const token = handler.generateToken({ email, role, username})
  console.log('token', token);
  return handler.send(res, 'Username Saved!', 201, 'success', {usernameUpdate, token})

};
// USER BIO SETUP
const bioSetup = async (req: Request, res: Response, next: NextFunction ) => {
  // USE CUSTOM VALIDATIONS TO ENSURE THAT THE FIELDS ARE CORRECT
  console.log('Hereee!!!')

  const { gender, sexuality, dob, occupation, quote, profile_picture, instagram, twitter, linkedin, facebook, snapchat } = req.body;

  const userBio = {
    gender, sexuality, dob, occupation, quote, instagram, twitter, linkedin, facebook, snapchat
  }

  const email = req.user?.email
  const user = await UserModel.findOneAndUpdate({email}, userBio, {new: true});

  if (!user){
   return next({message: 'User Not found', statusCode: 400, status: 'error'})
  }
  return handler.send(res, 'User profile created', 200, 'success', user)
};


// SEND EMAIL FOR PASSWORD RESET
// const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
//   try{
//     const { email } = req.body;
  
//     if (!email) {
//       return handler.send(res, 'Your Email is required!', 400, 'error');
//     }
//     // CHECK IF USER EXISTS IN THE DB
//     const user = await UserModel.findOne({email});
//     if (!user) {
//       return handler.send(res, 'User does not Exist!', 403, 'error');
//     }
    

//     let reset_token: string;
//     do{
//       reset_token = <string><unknown>nanoid;
//     }while (user?.reset_token === reset_token)

//     const resetPasswordExpires = dayjs().add(1, 'hour');
//     // encode a generated random token, the iat, and the user email address and send to the users email.
    
//     await UserModel.findOneAndUpdate({email}, {reset_token, resetPasswordExpires})

//     const items = [...reset_token, ...[resetPasswordExpires], ...user.email].join(',');
//     const hashItems = bcrypt.hashSync(items, 10);

//     // SEND EMAIL TO THE USER
//     const transporter = nodemailer.createTransport({
//       service: 'gmail'
//     })

    

//   }catch(error) {
//     console.log(error)
//   }

// }

// AUTHENTICATE REQUESTS
const isAuthUser = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false })(req, res, next);
};


// CHECK IF USER IS AN ADMIN
const isAdmin = async (req: Request, res: Response, next: NextFunction) => { 
  if(req.user && req.user?.role === 'admin'){
    console.log('here!!!!!')
    next();
  }else{
    return handler.send(res, 'Admin Token is not valid', 401, 'error');
  } 
}

// CHECK IF USER HAS COMPLETED THEIR PROFILE
const completeUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  console.log('req.user', req.user)
  console.log('email', req.user?.email)
  const {email, username} = req.user as Express.User;

  const userDetails = await UserModel.findOne({email});
  if(!userDetails){
    return handler.send(res, 'User not found!', 401, 'error');
  }

  const socialHandles = userDetails?.linkedin || userDetails?.instagram || userDetails?.facebook || userDetails?.twitter || userDetails?.snapchat
  console.log('userDetails, userDetails');
  if (userDetails?.role === 'customer' && userDetails.username && (socialHandles) && userDetails?.quote && userDetails?.profile_picture && userDetails?.profile_video) {
    next()
  } else {
    return handler.send(res, 'You have to complete your profile to view this page', 401, 'error');
  }
}


export default {
  userLogin,
  userRegister,
  isAdmin,
  completeUserProfile,
  isAuthUser,
  bioSetup,
  linkedinAuth,
  linkedinCallback,
  usernameInput
}
