import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import supportRequest from '../model/supportRequestModel';
import { validateSupportRequest } from '../validations/validation';
import APIfeatures from '../utils/apiFeatures';
import { string } from 'joi';
import fs from 'fs';

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

    console.log(req.user);

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

// a user can update his/her previous request
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

// support agent resolves a request and updates the status
export const updateRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user!;
    const { requestId } = req.params;
    const request = await supportRequest.find({
      _id: req.params.requestId,
    });

    if (!request) {
      return res.status(400).json({
        status: 'fail',
        message: 'Request does not exist',
      });
    }

    if (req.user?.user === 'customer') {
      return res.status(400).json({
        status: 'fail',
        message: 'only a support agent can update request status',
      });
    }

    const requestStatus = await supportRequest.findOneAndUpdate(
      { _id: requestId },
      { ...req.body, statusUpdatedAt: Date.now() },
      {
        new: true,
        validators: true,
      }
    );

    res.status(201).json({
      status: 'success',
      data: {
        requestStatus,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// get resolved requests by support agent in the last 30days

export const getResolvedStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user!;
    const { requestId } = req.params;

    // const requests = await supportRequest.find();
    let today = new Date();
    today.setDate(today.getDate() - 30);

    console.log(today);

    const resolvedRequests = await supportRequest.find({
      status: 'resolved',
      statusUpdatedAt: { $gte: today },
    });

    if (!resolvedRequests.length)
      return res.status(404).json({
        status: fail,
        message: 'No data found',
      });

    console.log(resolvedRequests, '<<<<<<');

    const fileName = `30-days-resolved-requests.csv`;

    const file = fs.createWriteStream(`./public/${fileName}`);

    file.write(
      'statusId,title,description,status,userId,createdAt,statusUpdatedAt\n'
    );

    resolvedRequests.forEach(function (v) {
      file.write(
        `${v._id};${v.title};${v.description}/${v.status}/${v.user}${v.createdAt}${v.statusUpdatedAt};` +
          '\n'
      );
    });

    const url = req.protocol + '://' + req.get('host');

    res.status(201).json({
      status: 'success',
      message: 'Resolved request file successcfully created',
      data: {
        // resolvedRequests,
        link: `${url}/${fileName}`,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

/**
 *
 *
 */
