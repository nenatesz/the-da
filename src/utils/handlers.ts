import express, { NextFunction, Request, Response } from 'express';
import config from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';

type tokenPayload = {
    email: string,
    role: string,
    username: string
}

interface NewJwtPayload extends JwtPayload {
    role: string;
}

class Handler {
    // RESPONSE HANDLER FOR RESPONSE MESSAGES
    
    /**
     * 
     * @param res The response object
     * @param message  The message to be sent to the client
     * @param statusCode The response statuscode
     * @param status error or success
     * @param data the response data. {} for an eoor message
     */
    send (res: Response, message: string, statusCode: number, status: string, data?: {}) {

        res.status(statusCode).json({
            status,
            message,
            data
          });
    };

    generateToken(payload: tokenPayload) : string {
        const token = jwt.sign({ email: payload.email, role: payload.role, username: payload.username }, <string>config.jwt_secret, { expiresIn: "10d" });    
        if(!token) throw new Error('Error Generating Token');

        return token;
        
    }

    verifyToken(token: string) {
        const verifiedToken = jwt.verify(token, <string>config.jwt_secret) as NewJwtPayload;
        if (!verifiedToken) throw new Error('Error verifying token');

        return verifiedToken;

    };

    cookieExtractor (req: Request): string {
        let token = null;
        if (req && req.cookies)
        {
            token = req.cookies['jwt'];
            console.log('token!', token)
        }
        return token;
    };
}

const handler = new Handler;
export default handler;