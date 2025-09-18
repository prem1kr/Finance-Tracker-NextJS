import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB successfully connected");
    } catch (error) {
        console.log("Error during Database connection:", error.message);
        process.exit(1);
    }
}

export default connectDB;
