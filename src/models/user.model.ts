import { kStringMaxLength } from "buffer";
import mongoose, {Model, Document, model, Schema} from "mongoose";

enum Role {
    admin = 'admin',
    customer = 'customer'

};

enum Provider {
    linkedin = 'linkedin',
    email = 'email'
}

export interface IUserDocument extends Document {
    fullname?: string;
    email: string;
    password?: string;
    username: string;
    gender?: string;
    sexuality?: string;
    dob?: Date;
    occupation?: string;
    quote?: string;
    profile_picture?: string;
    profile_video?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    snapchat?: string;
    verified?: boolean;
    verifiedDate?: Date;
    role: Role;
    iat?: string;
    passwordResetToken?: string;
    resetPasswordExpires?: Date;
    provider?: Provider;
    providerUserId?: string;
    providerImageUrl?: string;

};



export interface IUserModel extends Model<IUserDocument> {
    // add static methods here


};

const userSchema = new Schema<IUserDocument>({
    fullname: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    username: {type: String, unique: true},
    gender: {type: String},
    sexuality: {type: String},
    dob: {type: Date},
    occupation: {type: String},
    quote: {type: String},
    profile_picture: {type: String},
    profile_video: {type: String},
    instagram: {type: String},
    twitter: {type: String},
    linkedin: {type: String},
    facebook: {type: String},
    snapchat: {type: String},
    verified: {type: Boolean, required: true, default: false},
    verifiedDate: {type: Date},
    role: {type: String, enum: Role, required: true, default: Role.customer},
    iat: {type: String},
    passwordResetToken: {type: String},
    resetPasswordExpires: {type: Date},
    provider: {type: String, enum: Provider},
    providerUserId: {type: String},
    providerImageUrl: {type: String},

}, {timestamps: true});

userSchema.statics = {
    async getAllUsers() {
        // get all users detail
    },
    async getUser() {
        // get a user details
    }
}


const UserModel = model<IUserDocument, IUserModel>('UserModel', userSchema);

export  default UserModel;

