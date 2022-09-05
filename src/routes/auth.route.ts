import express from 'express';
import passport from 'passport';
import authController from '../controllers/auth.controller';
import authValidation from '../validation/auth.validation';

const authRouter = express.Router();


authRouter.post('/login', authValidation.validateLogin(), authController.userLogin);
authRouter.post('/register', authValidation.validateRegistration(), authController.userRegister);
authRouter.post('/username', authController.usernameInput);
authRouter.post('/biosetup', authController.isAuthUser, authValidation.validateBioSetup(), authController.bioSetup);
authRouter.get('/linkedin', authController.linkedinAuth);
authRouter.get("/linkedin/callback", authController.linkedinCallback);


export default authRouter;