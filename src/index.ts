import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import Handler from './utils/handlers';
import config from './config'
import Mongoose from './utils/mongoose';
import authRouter from './routes/auth.route';


const app = express();
const mongoose = new Mongoose();
mongoose.connect().then((res: any)=> console.log('Database Connected!')).catch((err: any)=> console.log('err', err))

const handler = new Handler();
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/auth', authRouter);
// Handle Errors
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack)
    console.log(`Error found whiile executing... ${error}`);
});


app.listen(config.port, () => {
    console.log(`app listening on port ${config.port}`);
});