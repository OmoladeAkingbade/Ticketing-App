/**
 * summary - This is the comment model file.
 * The file contains the comment schema that defines the the structure and contents of our comment data.
 */

import mongoose from 'mongoose';
import { IComment } from '../utils/interface';

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supportRequest',
    },
  },
  { timestamps: true }
);

const comments = mongoose.model('comments', commentSchema);

export default comments;
