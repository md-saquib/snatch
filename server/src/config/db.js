import mongoose from 'mongoose'
import config from './config.js'



const dbConnection = async () => {
    try {
        await mongoose.connect(config.MONGO_URI)
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error;
    }
} 

export default dbConnection