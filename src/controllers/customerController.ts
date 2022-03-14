import { Request, Response, NextFunction } from 'express';
import User from '../model/userModels';

export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await User.find();
    res.status(200).json({
      results: customers.length,
      status: 'success',
      data: {
        customers,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
