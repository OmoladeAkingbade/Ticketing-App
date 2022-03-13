import express, { Request, Response, NextFunction } from "express";
import User from '../model/userModels'
import { validateUserSignUp, validateUserLogin } from "../validation/validation";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const generateToken = (email: string) => {
    const token = jwt.sign({ email } , process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN,  
    })
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validate user details
        const isValid = validateUserSignUp.validate(req.body);
        // console.log(isValid);
    
        //  if request is not valid, send error message to client
        if (isValid.error) {
          return res.status(400).json({
            status: "fail",
            message: isValid.error.details[0].message,
          });
        }
        // create user
        const newUser = await User.create(req.body);
    
        res.status(201).json({
          status: "success",
          data: newUser,
          token: generateToken(newUser.email),
        });
      } catch (err: any) {
        if (err.code && err.code === 11000) {
          console.log(Object.values(err.keyValue));
          const duplicateErrorValue = Object.values(err.keyValue);
          return res.status(400).json({
            status: "fail",
            message: `${duplicateErrorValue}, already exist`,
          });
        }
    
        res.status(500).json({
          status: "error",
          message: "An error occured",
        });
      }
    };
    
    export const login = async (req: Request, res: Response) => {
      try {
        const isValid = validateUserLogin.validate(req.body);
    
        if (isValid.error) {
          return res.status(400).json({
            status: "fail",
            message: isValid.error.details[0].message,
          });
        }
    
        /**
         * find the user where email(in our database) = req.body.email and select password
         * if user does not exist, send error message
         */
    
        const user = await User.findOne({ email: req.body.email }).select([
          "+password",
          "-fullname",
        ]);

    
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
          return res.status(400).json({
            status: "fail",
            message: "inavalid login credentials",
          });
        }
    
        
        res.status(200).json({
          status: "success",
          message: " user logged in successfully",
          token: generateToken(user.email),
          data: user,
        });

      } catch (err) {
        res.status(500).json({
          status: "error",
          message: "An error occured",
        });
      }
    };

    export const protectRoute = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      let token: string | undefined;
    
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
    
      if (!token) {
        return res.status(401).json({
          status: "fail",
          message: "please provide auth token",
        });
      }
    
      try {
        const decodedToken: any = jwt.verify(
          token as string,
          process.env.JWT_SECRET as string
        );
        const user = await User.findOne({ email: decodedToken.email });
    
        // console.log(user, "***");
    
        if (user) {
          req.user = user;
        }
        next();
      } catch (err) {
        console.log(err);
    
        res.status(401).json({
          status: "fail",
          message: "invalid auth token",
        });
      }
    };
    
    
