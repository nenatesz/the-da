import express from 'express';
import authController from '../controllers/auth.controller';
import userController from '../controllers/user.controller';
import authValidation from '../validation/auth.validation';

const userRouter = express.Router();
// userRouter.get('/', authController.isAuthUser, authController.completeUserProfile, userController.getUsersProfile);
userRouter.get('/', authController.isAuthUser, authController.isAdmin, userController.getUsersProfile);

export default userRouter;
