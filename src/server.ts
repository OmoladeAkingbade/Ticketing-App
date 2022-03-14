import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { appendFile } from 'fs';
import { connectMockDB, connectDB } from './database/database';
import app from './app';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
  console.log(process.env.NODE_ENV, '***');
  connectMockDB();
} else {
  connectDB();
}

const port = process.env.PORT || 4005;

app.listen(port, () => console.log(`server running on port ${port}`));
