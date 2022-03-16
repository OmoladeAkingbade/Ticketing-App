/**
 * summary - This file holds the function to create memory server and the function to clean up the server after running all tests
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memServer: MongoMemoryServer;
// function to create memory server
export const connectMemoryServer = async () => {
  memServer = await MongoMemoryServer.create();
  const dbUrl = memServer.getUri();
  mongoose.connect(dbUrl).then(() => console.log('Memory server connected.'));
};

// function to clean up the server
export const cleanUpMemoryServer = async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
  await memServer.stop();
  console.log('disconnected successfully.');
};
