"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserLogin = exports.validateUserSignUp = void 0;
const joi_1 = __importDefault(require("joi"));
exports.validateUserSignUp = joi_1.default.object({
    email: joi_1.default.string().email().trim(),
    password: joi_1.default.string()
        .required()
        .min(10)
        .max(20)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    fullname: joi_1.default.string().required().trim().min(1).max(50),
});
exports.validateUserLogin = joi_1.default.object({
    email: joi_1.default.string().email().trim(),
    password: joi_1.default.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
