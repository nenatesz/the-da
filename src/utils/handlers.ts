import express, { NextFunction, Request, Response } from 'express';



class Handler {
    // RESPONSE HANDLER FOR RESPONSE MESSAGES
    
    send (res: Response, message: string, statusCode: number, status: string, data?: {}) {

        res.status(statusCode).json({
            status,
            message,
            data
          });
    };


}

export default Handler;