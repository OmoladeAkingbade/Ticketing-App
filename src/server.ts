import express,{Application, Request, Response, NextFunction}from 'express'
import dotenv from 'dotenv'
import { appendFile } from 'fs';

import app from './app'

dotenv.config();


const port = process.env.PORT || 4005;

app.listen(port, () => console.log(`server running on port ${port}`))