 /**
  * summary - This is a file that holds the database configurations. 
  * This file also holds connection to MongoDB Memory Server. The mongodb-memory-server package spins up an actual/real MongoDB server programmatically from within nodejs, for testing or mocking during development.
*/
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// real database connection
export const connectDB = () => {
  try {
    const DB = process.env.DATABASE_URL?.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD!
    ) as string;

    // Connect to MongoDB
    mongoose.connect(DB).then(() => {
      console.log(`DB connection successful....`);
    });
  } catch (error) {
    console.log(error);
  }
};

// mock database connection
export const connectMockDB = () => {
  try {
    MongoMemoryServer.create().then(mongo => {
      const uri = mongo.getUri();

      mongoose.connect(uri).then(() => {
        console.log(`Mock DB connected...`);
      });
    });
  } catch (error) {
    console.log(error);
  }
};
