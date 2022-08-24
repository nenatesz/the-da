import dotenv from 'dotenv';

dotenv.config();

const {
    PORT,
    MONGOURI,
    JWT_SECRET
} = process.env;

const config = {
    port: PORT || 5050,
    mongoURI: MONGOURI as string,
    jwt_secret: JWT_SECRET as string

};
export default config;