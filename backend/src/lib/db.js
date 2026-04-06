import mongoose from 'mongoose';
// import { createClient } from "redis";

// const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.CLOUD_MONGO_URI);
    console.log('MongoDB connected');
    // console.log('Connecting to Redis...');
    // await redisClient.connect();
    // console.log('Redis connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export { connectDB };