import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    password: string;
    fullname: string;
    timestamps: boolean;
    email: string;
    user: string;
  }