"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database/database");
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
if (process.env.NODE_ENV === 'test') {
    console.log(process.env.NODE_ENV, '***');
    (0, database_1.connectMockDB)();
}
else {
    (0, database_1.connectDB)();
}
const port = process.env.PORT || 4005;
app_1.default.listen(port, () => console.log(`server running on port ${port}`));
