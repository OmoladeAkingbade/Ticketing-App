"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const userModels_1 = __importDefault(require("../model/userModels"));
const validation_1 = require("../validation/validation");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (email) => {
    const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validate user details
        const isValid = validation_1.validateUserSignUp.validate(req.body);
        // console.log(isValid);
        //  if request is not valid, send error message to client
        if (isValid.error) {
            return res.status(400).json({
                status: "fail",
                message: isValid.error.details[0].message,
            });
        }
        // create user
        const newUser = yield userModels_1.default.create(req.body);
        res.status(201).json({
            status: "success",
            data: newUser,
            token: generateToken(newUser.email),
        });
    }
    catch (err) {
        if (err.code && err.code === 11000) {
            console.log(Object.values(err.keyValue));
            const duplicateErrorValue = Object.values(err.keyValue);
            return res.status(400).json({
                status: "fail",
                message: `${duplicateErrorValue}, already exist`,
            });
        }
        res.status(500).json({
            status: "error",
            message: "An error occured",
        });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValid = validation_1.validateUserLogin.validate(req.body);
        if (isValid.error) {
            return res.status(400).json({
                status: "fail",
                message: isValid.error.details[0].message,
            });
        }
        /**
         * find the user where email(in our database) = req.body.email and select password
         * if user does not exist, send error message
         */
        const user = yield userModels_1.default.findOne({ email: req.body.email }).select([
            "+password",
            "-fullname",
        ]);
        if (!user || !(yield bcryptjs_1.default.compare(req.body.password, user.password))) {
            return res.status(400).json({
                status: "fail",
                message: "inavalid login credentials",
            });
        }
        res.status(200).json({
            status: "success",
            message: " user logged in successfully",
            token: generateToken(user.email),
            data: user,
        });
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            message: "An error occured",
        });
    }
});
exports.login = login;
