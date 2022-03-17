import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  password: string;
  fullname: string;
  timestamps: boolean;
  email: string;
  user: string;
}

export interface ISupportRequest {
  title: string;
  description: string;
  customerCanComment: boolean;
  statusUpdatedAt: Date;
  createdAt: Date;
  status: string | undefined;
  user: string | undefined;
  timestamps: string;
}

export interface IComment {
  content: string;
  user: string | undefined;
  request: string | undefined;
  timestamps: string;
}
