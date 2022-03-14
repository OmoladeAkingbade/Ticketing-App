"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supportRequestSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        // required: [true, "a user must be provided"],
    },
}, { timestamps: true });
const supportRequest = mongoose_1.default.model('supportRequest', supportRequestSchema);
exports.default = supportRequest;
