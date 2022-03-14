import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectMockDB, connectDB } from './database/database';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute';
import supportRouter from './routes/supportRoute'

dotenv.config();
const app: Application = express();

// MIDDLEWARES
app.use(cors());

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/users/', userRouter);
app.use('/api/v1/support/',supportRouter);

export default app;
