"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    request: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'supportRequest',
        //   required: true,
    },
}, { timestamps: true });
const comments = mongoose_1.default.model('comments', commentSchema);
exports.default = comments;
