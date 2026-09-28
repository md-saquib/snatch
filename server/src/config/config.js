import dotenv from 'dotenv';

dotenv.config()

const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 3000,
    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY
};

export default config;
