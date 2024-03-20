import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  const MONGO_URL = process.env.MONGO_URL;
  try {
    mongoose.connect(`${MONGO_URL}`, {});
    console.log("Connected to MongoDB");
  } catch (err: any) {
    console.error("Can't connect to mongoose database", err.message);
  }
};
