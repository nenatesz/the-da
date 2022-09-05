import dotenv from 'dotenv';

dotenv.config();

const {
    PORT,
    MONGOURI,
    JWT_SECRET,
    linkedInClientId,
    linkedInClientSecret,
    devURL,
    prodURL
} = process.env;

const config = {
    port: PORT || 5050,
    mongoURI: MONGOURI as string,
    jwt_secret: JWT_SECRET as string,
    linkedInClientId: linkedInClientId as string,
    linkedInClientSecret: linkedInClientSecret as string,
    devURL: devURL as string,
    prodURL: prodURL as string,

};
export default config;