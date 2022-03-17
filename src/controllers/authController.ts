/**
 * summary - This is an authentication controller. This file is used to register, login and verify     users. It also has the protectRoute function to verify a user before they can access certain routes
 */

import { Request, Response, NextFunction } from 'express';
import User from '../model/userModels';
import {
  validateUserSignUp,
  validateUserLogin,
} from '../validations/validation';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 *
 * @param email
 * @returns {
 * data : new user data
 * }
 */
const generateToken = (email: string) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate user details
    const isValid = validateUserSignUp.validate(req.body);

    //  if request is not valid, send error message to client
    if (isValid.error) {
      return res.status(400).json({
        status: 'fail',
        message: isValid.error.details[0].message,
      });
    }
    // if user passes validation, create user
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newUser,
      token: generateToken(newUser.email),
    });
  } catch (err: any) {
    // check if the error type is aduplicate error i.e if the user already exist
    if (err.code && err.code === 11000) {
      console.log(Object.values(err.keyValue));
      const duplicateErrorValue = Object.values(err.keyValue);
      return res.status(400).json({
        status: 'fail',
        message: `${duplicateErrorValue}, already exist`,
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'An error occured',
    });
  }
};

/**
 *
 * @param req
 * @param res
 * @returns {
 * data : logged in user data
 * }
 */
export const login = async (req: Request, res: Response) => {
  try {
    const isValid = validateUserLogin.validate(req.body);

    if (isValid.error) {
      return res.status(400).json({
        status: 'fail',
        message: isValid.error.details[0].message,
      });
    }

    /**
     * find the user where email(in our database) = req.body.email and select password
     * if user does not exist, send error message
     * else, if the user exist, login the user
     */
    const user = await User.findOne({ email: req.body.email }).select([
      '+password',
      '-fullname',
    ]);

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({
        status: 'fail',
        message: 'inavalid login credentials',
      });
    }

    res.status(200).json({
      status: 'success',
      message: ' user logged in successfully',
      token: generateToken(user.email),
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error occured',
    });
  }
};

/**
 * we use jwt is used to create and verify tokens for users
 * when a new user is created, their password will also be hashed and stored
 * when an existing user signs in, his/her password is verified
 * if there's no token provided, send error message
 */
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'please provide auth token',
    });
  }

  try {
    const decodedToken: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );
    const user = await User.findOne({ email: decodedToken.email });

    if (user) {
      req.user = user;
    }
    next();
  } catch (err) {
    console.log(err);

    res.status(401).json({
      status: 'fail',
      message: 'invalid auth token',
    });
  }
};
