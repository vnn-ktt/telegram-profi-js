import * as mongoose from "mongoose";
import EnvironmentManager from "../classes/EnvironmentManager.js";

export const connectToDatabase = async (): Promise<void> => {
    try {
        const MONGODB_URI = EnvironmentManager.getInstance().getVariable("MONGODB_URI");
        if (!MONGODB_URI) {
            throw new Error("MongoDB URI is missing");
        }
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 50000,
            connectionTimeoutMS: 10000,
        });
        console.log("Connected to Database");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export const disconnectFromDatabase = async (): Promise<void> => {
    await mongoose.disconnect();
    console.log("Disconnected from Database");
}

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});
