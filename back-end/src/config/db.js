import { mongoose } from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected to : ${mongoose.connection.host} AND ${mongoose.connection.name}`);
    } catch (error) {
        console.log(`Database Connection Error: ${error}`);
        throw error;
    }
}
