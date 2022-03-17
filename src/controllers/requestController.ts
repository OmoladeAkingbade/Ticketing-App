/**
 * summary - This is the support request controller that handles retrieving and modifying of requests
 */

import { Request, Response, NextFunction } from 'express';
import supportRequest from '../model/supportRequestModel';
import { validateSupportRequest } from '../validations/validation';
import APIfeatures from '../utils/apiFeatures';
import fs from 'fs';

/**
 *
 * @param req
 * @param res
 * @returns {
 * newSupportRequest: support requests created by customer
 * }
 */
export const createSupportRequest = async (req: Request, res: Response) => {
  try {
    // validates the request coming from the request body, if there is an error, returns error message
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

/**
 *
 * @param req
 * @param res
 * @param next
 * * @returns {
 * request: all requests that a user has created
 * }
 */

export const getAllPreviousRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // pagination to get data(previous created requests) back in chunks
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

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {
 * request: get one request from a user's  previous requests
 * }
 */
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

    if (!request)
      return res.status(404).json({
        status: 'fail',
        message: 'request does not exist',
      });

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

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {
 * updateRequest: an updated  customer support request
 * }
 */
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
    // if no such request exist, return an error message to the user
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

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns  {
  * requestStatus : an object that contains the status of each resolved requests by a support agent
      }
 */
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

    // check if such request exist
    if (!request) {
      return res.status(400).json({
        status: 'fail',
        message: 'Request does not exist',
      });
    }

    // only a support agent is allowed to resolve and update request status.
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

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns  {
 *  link: csv file that contains all resolved requests in the last 30 days
 * }
 */

export const getResolvedStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user!;

    let today = new Date();
    today.setDate(today.getDate() - 30); // backdate Date by 30days

    // get requests that are resolved and was updated in the last 30 days
    const resolvedRequests = await supportRequest.find({
      status: 'resolved',
      statusUpdatedAt: { $gte: today },
    });

    // return error message if there are no resolved requests found
    if (!resolvedRequests.length)
      return res.status(404).json({
        status: fail,
        message: 'No data found',
      });

    const fileName = `30-days-resolved-requests.csv`;

    // writestream to write file
    const file = fs.createWriteStream(`./public/${fileName}`);

    file.write(
      'statusId,title,description,status,userId,createdAt,statusUpdatedAt\n'
    );

    // write rows in the csv file
    resolvedRequests.forEach(function (v) {
      file.write(
        `${v._id};${v.title};${v.description}/${v.status}/${v.user}${v.createdAt}${v.statusUpdatedAt};` +
          '\n'
      );
    });

    // get url of the server
    const url = req.protocol + '://' + req.get('host');

    res.status(200).json({
      status: 'success',
      message: 'Resolved request file successcfully created',
      data: {
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
