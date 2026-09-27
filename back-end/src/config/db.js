import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info(`MongoDB Connected to : ${mongoose.connection.host} AND ${mongoose.connection.name}`);
    } catch (error) {
        logger.error(`Database Connection Error: ${error.message}`, { error });
        throw error;
    }
}
