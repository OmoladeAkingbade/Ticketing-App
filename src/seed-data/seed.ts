import supportRequest from '../model/supportRequestModel';
import mongoose from 'mongoose';
import User from '../model/userModels';
import comments from '../model/commentModel';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = () => {
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

const seedData = async () => {
  //users collection
  const allUsers = JSON.parse(
    fs.readFileSync(__dirname + '/../../users.json', 'utf-8')
  );

  // supportRequest colection
  const allSupportRequests = JSON.parse(
    fs.readFileSync(__dirname + '/../../supportrequests.json', 'utf-8')
  );
  // comment collection
  const allComments = JSON.parse(
    fs.readFileSync(__dirname + '/../../comments.json', 'utf-8')
  );

  // delete all users, create users
  await User.deleteMany();
  await User.insertMany(allUsers);

  // delete support requests, create support requests
  await supportRequest.deleteMany();
  await supportRequest.insertMany(allSupportRequests);

  // delete comments
  await comments.deleteMany();
  await comments.insertMany(allComments);
};

connectDB();

seedData()
  .then(() => {
    console.log('done');
  })
  .catch(err => {
    console.error(err);
  });
