"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
``;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const commentController_1 = require("../controllers/commentController");
const requestController_1 = require("../controllers/requestController");
const router = express_1.default.Router();
router.route('/').post(authController_1.protectRoute, requestController_1.createSupportRequest);
router
    .route('/requests') //view previous request
    .get(authController_1.protectRoute, requestController_1.getAllPreviousRequests);
router
    .route('/requests/:requestId')
    .get(authController_1.protectRoute, requestController_1.getOneRequest)
    .put(authController_1.protectRoute, requestController_1.updateRequest);
router
    .route('/requests/status/:requestId')
    .put(authController_1.protectRoute, requestController_1.updateRequestStatus);
router.route('/get-resolved-requests').get(authController_1.protectRoute, requestController_1.getResolvedStatus);
router.route('/requests/comments/:requestId').post(authController_1.protectRoute, commentController_1.createComment);
exports.default = router;
