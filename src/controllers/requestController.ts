import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import supportRequest from '../model/supportRequestModel';
import { validateSupportRequest } from '../validations/validation';
import APIfeatures from '../utils/apiFeatures';

export const createSupportRequest = async (req: Request, res: Response) => {
  try {
    const isValid = validateSupportRequest.validate(req.body);

    if (isValid.error) {
      return res.status(400).json({
        status: 'fail',
        message: isValid.error.details[0].message,
      });
    }
    const newSupportRequest = await supportRequest.create({
      ...req.body,
      user: req.user?._id,
    });
    console.log(newSupportRequest);
    res.status(201).json({
      status: 'success',
      message: 'request successfully created',
      data: {
        newSupportRequest,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).send('an error occured');
  }
};

//  get all requests that a user has created
export const getAllPreviousRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user!;
    const query = supportRequest.find({ user: _id });
    const features = new APIfeatures(query, req.query).paginate();
    const request = await features.query;

    res.status(200).json({
      results: request.length,
      status: 'success',
      data: {
        request,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

//   get one request from a user's  previous requests
export const getOneRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { requestId } = req.params;
    const { _id } = req.user!;

    const request = await supportRequest.findOne({ user: _id, _id: requestId });
    res.status(200).json({
      status: 'success',
      data: {
        request,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user!;
    const { requestId } = req.params;
    const updateRequest = await supportRequest.findOneAndUpdate(
      { user: _id, _id: requestId },
      req.body,
      {
        new: true,
        validators: true,
      }
    );

    if (updateRequest === null) {
      return res.status(400).json({
        status: 'fail',
        message: 'request not created by current user or request not found',
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        updateRequest,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
