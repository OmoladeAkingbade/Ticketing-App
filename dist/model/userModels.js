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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'A user must have an email'],
        lowercase: true,
        validate: [validator_1.default.isEmail, 'A user must have a valid email'],
    },
    user: {
        type: String,
        required: [true, 'the type of user should be specified'],
        enum: ['admin', 'customer', 'support'],
        default: 'customer',
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        trim: true,
        select: false,
        maxlength: [20, 'A password must have less or equal to 20 characters'],
        minlength: [
            10,
            'A password name must have more or equal to 10 characters',
        ],
    },
    fullname: {
        type: String,
        required: [true, 'A user must have a fullname'],
        trim: true,
    },
}, { timestamps: true });
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.password && this.isModified('password')) {
            this.password = yield bcryptjs_1.default.hash(this.password, 10);
        }
        next();
    });
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
