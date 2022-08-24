import mongoose, { ConnectOptions } from 'mongoose';
import config from '../config';

// Mongoose class that connects to the mongoDB database
class Mongoose {
    connect(): any {
        return new Promise((resolve, reject) => {
            mongoose.connect(config.mongoURI, {
                // useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            } as ConnectOptions).then(() => {
                resolve(mongoose.connection)
            }).catch((err) => {
                reject(err);

            })
        })
        
    }
};


export default Mongoose;