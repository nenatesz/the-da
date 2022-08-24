import express from 'express';
import authController from '../controllers/auth.controller';

const authRouter = express.Router();


authRouter.post('/login', authController.userLogin);
authRouter.post('/register', authController.userRegister);

export default authRouter;
