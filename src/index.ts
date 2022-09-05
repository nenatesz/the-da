import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import handler from './utils/handlers';
import config from './config'
import Mongoose from './utils/mongoose';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import passport from 'passport';
import session from 'express-session';


const app = express();
const mongoose = new Mongoose();
mongoose.connect().then((res: any) => console.log('Database Connected!')).catch((err: any)=> console.log('err', err))

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(cors());


// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
// }));
// // app.use(passport.initialize());
// // app.use(passport.session());
// passport.serializeUser(function(user, cb) {
//     process.nextTick(function() {
//       return cb(null, user);
//     });
//   });
  
// passport.deserializeUser(function(user: Express.User, cb) {
// process.nextTick(function() {
//     return cb(null, user);
// });
// });
// app.use(passport.session());

app.use('/auth', authRouter);
app.use('/users', userRouter);

// Handle Errors
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(`Error found whiile executing... ${error.message ?? error}`);
    return handler.send(res, error.message, error.statusCode, error.status);
});

app.listen(config.port, () => {
    console.log(`app listening on port ${config.port}`);
});