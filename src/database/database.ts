import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";




export const  connectDB = () => {

    try {
      const DB = process.env.DATABASE_URL?.replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD!
      ) as string;
  
      // Connect to MongoDB
      mongoose
        .connect(DB)
        .then( () => {
          console.log(`DB connection successful....`)})
    }catch (error) {
        console.log(error);
      }

}
    
  

  export const  connectMockDB  = () => {
    try {
      MongoMemoryServer.create().then((mongo) => {
        const uri = mongo.getUri();

        mongoose.connect(uri).then(() => {
          console.log(`Mock DB connected...`);
        });

      });
    } catch (error) {
      console.log(error);
    }
  };




