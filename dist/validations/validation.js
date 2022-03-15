"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateComment = exports.validateSupportRequest = exports.validateUserLogin = exports.validateUserSignUp = void 0;
const joi_1 = __importDefault(require("joi"));
exports.validateUserSignUp = joi_1.default.object({
    email: joi_1.default.string().email().trim(),
    password: joi_1.default.string()
        .required()
        .min(10)
        .max(20)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    fullname: joi_1.default.string().required().trim().min(1).max(50),
    user: joi_1.default.string()
});
exports.validateUserLogin = joi_1.default.object({
    email: joi_1.default.string().email().trim(),
    password: joi_1.default.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
exports.validateSupportRequest = joi_1.default.object({
    title: joi_1.default.string().required().trim(),
    description: joi_1.default.string().required().trim(),
    status: joi_1.default.string().trim(),
    // userId: Joi.string().required(),
    timestamps: Date
});
exports.validateComment = joi_1.default.object({
    content: joi_1.default.string().required().trim(),
    user: joi_1.default.string().required().trim(),
    request: joi_1.default.string().trim(),
    // userId: Joi.string().required(),
    timestamps: Date
});
