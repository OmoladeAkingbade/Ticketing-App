import express, { Application, Request, Response, NextFunction } from 'express';
import { signup,login, protectRoute} from '../controllers/authController';
import { createSupportRequest } from '../controllers/requestController';


const router = express.Router();

router
    .route('/signup')
    .post(signup)

    router.
    route('/login')
    .post(login)

  


export default router