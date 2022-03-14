import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 *   MongoMemoryServer.create().then((mongo) => {
        const uri = mongo.getUri();

        mongoose.connect(uri).then(() => {
          console.log(`Mock DB connected...`);
        });

      });
 */

let memServer: MongoMemoryServer;

export const connectMemoryServer = async () => {
  memServer = await MongoMemoryServer.create();
  const dbUrl = memServer.getUri();
  mongoose.connect(dbUrl).then(() => console.log('Memory server connected.'));
};

export const cleanUpMemoryServer = async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
  await memServer.stop();
  console.log('disconnected successfully.');
};
