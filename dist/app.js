"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./database/db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// MIDDLEWARES
app.use((0, cors_1.default)());
app.use(express_1.default.json());
if (process.env.NODE_ENV === "test") {
    console.log(process.env.NODE_ENV, '***');
    (0, db_1.connectMockDB)();
}
else {
    (0, db_1.connectDB)();
}
// app.use('/api/v1/users/', userRouter);
// app.use('/api/v1/support/supportRouter');
exports.default = app;
