import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // userId: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

const comments = mongoose.model('supportRequest', commentSchema);

export default comments;
