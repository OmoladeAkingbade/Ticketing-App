import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectMockDB, connectDB } from "./database/db";
import dotenv from 'dotenv'

dotenv.config();
const app: Application = express();

// MIDDLEWARES
app.use(cors());

app.use(express.json());

if (process.env.NODE_ENV === "test") {
    console.log(process.env.NODE_ENV, '***')
    connectMockDB();
  } else {
    connectDB();
  }

// app.use('/api/v1/users/', userRouter);
// app.use('/api/v1/support/supportRouter');

export default app;
