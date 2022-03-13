import express,{ Application, Request, Response, NextFunction } from "express"
import morgan from 'morgan'
import cors from 'cors'


const app: Application = express();

// MIDDLEWARES
app.use(cors());

app.use(express.json());


app.use('/api/v1/users/, userRouter')
app.use('/api/v1/support/supportRouter')

export default app