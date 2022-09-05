import { Request, Response, NextFunction } from 'express';
import UserModel, { IUserDocument } from '../models/user.model';

const USER_EXCLUDE_PROJECTIONS = {
    password: 0,
    providerUserId: 0,
    providerImageUrl: 0,
    verified: 0,
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
    iat: 0,
    role: 0,
}
const getUsersProfile = async ( req: Request, res: Response, next: NextFunction ) => {
    console.log('user', req.user)
    const users: IUserDocument[] | null = await UserModel.find({}, {...USER_EXCLUDE_PROJECTIONS}).exec();

    return res.json(users);
};

export default {
    getUsersProfile
}