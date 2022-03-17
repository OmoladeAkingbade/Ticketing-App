/**
 * summary - This is the comment controller. This file has handlers to allow user (customer and support agent to create comment on support requests)
 */

import { Request, Response, NextFunction } from 'express';
import Comments from '../model/commentModel';
import request from '../model/supportRequestModel';
import { validateComment } from '../validations/validation';

/**
 *
 * @param req
 * @param res
 * @returns {
 * data : a comment created by support agent
 * }
 */

export const createComment = async (req: Request, res: Response) => {
  try {
    // validates the request coming from the request body, if there is an error, returns error message to user
    const isValid = validateComment.validate(req.body);

    if (isValid.error) {
      return res.status(400).json({
        status: 'fail',
        message: isValid.error.details[0].message,
      });
    }
    // Get user. check if there's no request with the provided request Id, return error message to the user
    const user = req.user;
    const supportRequest = await request.findById(req.params.requestId);
    if (!supportRequest) {
      return res.status(404).json({
        status: 'fail',
        message: 'request not found',
      });
    }

    // check if the logged in user is a support staff, then he/she can comment
    if (user?.user == 'support') {
      const comment = await Comments.create({ ...req.body, user: user?._id });
      supportRequest.customerCanComment = true;
      await supportRequest.save();

      return res.status(201).json({
        status: 'success',
        message: ' comment successfully created',
        data: {
          comment,
          requestId: supportRequest._id,
        },
      });
    }

    // if customerCanComment is true, a customer can create comment, else return an error message
    const customerCanComment = supportRequest.customerCanComment;
    if (customerCanComment === true) {
      const comment = await Comments.create({ ...req.body, user: user?._id });
      return res.status(201).json({
        status: 'success',
        message: ' comment successfully created',
        data: {
          comment,
        },
      });
    }
    res.status(400).json({
      status: 'fail',
      message: 'comment cannot be created ',
    });
  } catch (err) {
    console.log(err);
    res.status(400).send('Not Found');
  }
};
