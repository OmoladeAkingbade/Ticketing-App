"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
``;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const requestController_1 = require("../controllers/requestController");
const router = express_1.default.Router();
router
    .route('/')
    .post(authController_1.protectRoute, requestController_1.createSupportRequest);
router
    .route('/requests') //view previous request
    .get(authController_1.protectRoute, requestController_1.getAllPreviousRequests);
exports.default = router;
