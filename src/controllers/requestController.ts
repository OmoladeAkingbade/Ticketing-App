import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import supportRequest from '../model/supportRequestModel';
import { validateSupportRequest } from '../validations/validation';

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
