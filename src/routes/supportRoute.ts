``;
import express, { Application, Request, Response, NextFunction } from 'express';
import { protectRoute } from '../controllers/authController';
import { createComment } from '../controllers/commentController';
import {
  createSupportRequest,
  getAllPreviousRequests,
  getOneRequest,
  getResolvedStatus,
  updateRequest,
  updateRequestStatus,
} from '../controllers/requestController';

const router = express.Router();

router.route('/').post(protectRoute, createSupportRequest);

router
  .route('/requests') //view previous request
  .get(protectRoute, getAllPreviousRequests);

router
  .route('/requests/:requestId')
  .get(protectRoute, getOneRequest)
  .put(protectRoute, updateRequest);

router
  .route('/requests/status/:requestId')
  .put(protectRoute, updateRequestStatus);


router.route('/get-resolved-requests').get(protectRoute, getResolvedStatus);

router.route('/requests/comments/:requestId').post(protectRoute, createComment);

export default router;
