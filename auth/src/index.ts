import 'dotenv/config';
import mongoose from 'mongoose';
import mongoConfig from './config/mongo';
import app from './app';

const start = async () => {
  console.log('Starting up...');
  try {
    await mongoose.connect(mongoConfig.mongo.uri);
    console.log(`Connected to MongoDb: ${mongoConfig.mongo.uri}`);
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
