import { boolean } from 'joi';
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
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
      //   required: true,
    },
  },
  { timestamps: true }
);

const comments = mongoose.model('comments', commentSchema);

export default comments;
