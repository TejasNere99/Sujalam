import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sujalam';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'sujalam';

let isConnected = false;

export const connectMongoDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const getMongoDBStatus = () => {
  return isConnected ? 'connected' : 'disconnected';
};

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
