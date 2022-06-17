import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.jwt) {
    throw new Error('JWT key is undefined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is undefined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
