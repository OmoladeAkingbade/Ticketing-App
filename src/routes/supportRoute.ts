``
import express, { Application, Request, Response, NextFunction } from 'express';
import { protectRoute } from '../controllers/authController';
import { createSupportRequest } from '../controllers/requestController';


const router = express.Router();



router
.route('/request')
.post(protectRoute, createSupportRequest)

export default router