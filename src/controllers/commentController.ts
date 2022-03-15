import { Request, Response, NextFunction } from 'express';
import Comments from '../model/commentModel';
import request from '../model/supportRequestModel';
import { validateComment } from '../validations/validation';

export const createComment = async (req: Request, res: Response) => {
  try {
    const isValid = validateComment.validate(req.body);

    if (isValid.error) {
      return res.status(400).json({
        status: 'fail',
        message: isValid.error.details[0].message,
      });
    }
    const user = req.user;
    const supportRequest = await request.findById(req.params.requestId);
    console.log(supportRequest, '>>>>>>>>>');
    if (!supportRequest) {
      return res.status(404).json({
        status: 'fail',
        message: 'request not found',
      });
    }

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

// const user = await User.findById(req.user?._id);
// const typeOfUser = user?.user;

// const request = await supportRequest.findById(req.params.id);
// this should be the request id the comment is being  created for. so you ref the request on the comment schema.

// after which, check if there is a comment with that request id already existing.

// if (typeOfUser != 'support') {
//   res.status(403).json({
//     status: 'fail',
//     message: 'a support agent has to comment first',
//   });
// }
