import mongoose from 'mongoose';

const supportRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A request must have a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A request must have a description']
  },
  status: {
    type: String,
    enum: { 
       values: ['resolved', 'pending'],
        message: ["a request can either be pending or resolved"]
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: [true, "a user must be provided"],
  },
},
{timestamps: true}
);

const supportRequest  = mongoose.model('supportRequest', supportRequestSchema);

export default supportRequest;