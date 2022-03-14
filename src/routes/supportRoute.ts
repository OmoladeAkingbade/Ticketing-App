``
import express, { Application, Request, Response, NextFunction } from 'express';
import { protectRoute } from '../controllers/authController';
import { createSupportRequest, getAllPreviousRequests } from '../controllers/requestController';


const router = express.Router();



router
.route('/')
.post(protectRoute, createSupportRequest)

router
    .route('/requests') //view previous request
    .get(protectRoute, getAllPreviousRequests)


export default router