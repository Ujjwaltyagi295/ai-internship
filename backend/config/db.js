import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

export default async function connectDb() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('Missing MONGO_URI environment variable');
  }

  try {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error', error);
    throw error;
  }
}
