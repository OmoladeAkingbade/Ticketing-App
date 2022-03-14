``
import express, { Application, Request, Response, NextFunction } from 'express';
import { protectRoute } from '../controllers/authController';
import { createSupportRequest, getAllPreviousRequests, getOneRequest, updateRequest} from '../controllers/requestController';


const router = express.Router();



router
.route('/')
.post(protectRoute, createSupportRequest)

router
    .route('/requests') //view previous request
    .get(protectRoute, getAllPreviousRequests)

router
    .route('/requests/:requestId')
    .get(protectRoute, getOneRequest )
    .put(protectRoute, updateRequest)
    


export default router