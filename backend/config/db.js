import mongoose from "mongoose";
import { MongoClient } from "mongodb";

// mongoose implementation
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// mongoClient for raw database queries
export const getRegularDB = async () => {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db("test");
  const collection = db.collection("events");
  return { db, collection, client };
};
