import mongoose, {Model, Document, model, Schema} from "mongoose";

enum Role {
    admin = 'admin',
    customer = 'customer'

};

export interface IUserDocument extends Document {
    email: string;
    password: string;
    username: string;
    gender: string;
    sexuality: string;
    dob: Date;
    occupation: string;
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
    

};



export interface IUserModel extends Model<IUserDocument> {
    // add static methods here


};

const userSchema = new Schema<IUserDocument>({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    gender: {type: String, required: true},
    sexuality: {type: String, required: true},
    dob: {type: Date, required: true},
    occupation: {type: String, required: true},
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
    iat: {type: String}

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

