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
exports.getResolvedStatus = exports.updateRequestStatus = exports.updateRequest = exports.getOneRequest = exports.getAllPreviousRequests = exports.createSupportRequest = void 0;
const supportRequestModel_1 = __importDefault(require("../model/supportRequestModel"));
const validation_1 = require("../validations/validation");
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const createSupportRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isValid = validation_1.validateSupportRequest.validate(req.body);
        if (isValid.error) {
            return res.status(400).json({
                status: 'fail',
                message: isValid.error.details[0].message,
            });
        }
        const newSupportRequest = yield supportRequestModel_1.default.create(Object.assign(Object.assign({}, req.body), { user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }));
        console.log(newSupportRequest);
        res.status(201).json({
            status: 'success',
            message: 'request successfully created',
            data: {
                newSupportRequest,
            },
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).send('an error occured');
    }
});
exports.createSupportRequest = createSupportRequest;
//  get all requests that a user has created
const getAllPreviousRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const query = supportRequestModel_1.default.find({ user: _id });
        const features = new apiFeatures_1.default(query, req.query).paginate();
        const request = yield features.query;
        res.status(200).json({
            results: request.length,
            status: 'success',
            data: {
                request,
            },
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAllPreviousRequests = getAllPreviousRequests;
//   get one request from a user's  previous requests
const getOneRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.params;
        const { _id } = req.user;
        console.log(req.user);
        const request = yield supportRequestModel_1.default.findOne({ user: _id, _id: requestId });
        res.status(200).json({
            status: 'success',
            data: {
                request,
            },
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getOneRequest = getOneRequest;
// a user can update his/her previous request
const updateRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const { requestId } = req.params;
        const updateRequest = yield supportRequestModel_1.default.findOneAndUpdate({ user: _id, _id: requestId }, req.body, {
            new: true,
            validators: true,
        });
        if (updateRequest === null) {
            return res.status(400).json({
                status: 'fail',
                message: 'request not created by current user or request not found',
            });
        }
        res.status(201).json({
            status: 'success',
            data: {
                updateRequest,
            },
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
});
exports.updateRequest = updateRequest;
// support agent resolves a request and updates the status
const updateRequestStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { _id } = req.user;
        const { requestId } = req.params;
        const request = yield supportRequestModel_1.default.find({
            _id: req.params.requestId,
        });
        if (!request) {
            return res.status(400).json({
                status: 'fail',
                message: 'Request does not exist',
            });
        }
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.user) === 'customer') {
            return res.status(400).json({
                status: 'fail',
                message: 'only a support agent can update request status',
            });
        }
        const requestStatus = yield supportRequestModel_1.default.findOneAndUpdate({ _id: requestId }, Object.assign(Object.assign({}, req.body), { statusUpdatedAt: Date.now() }), {
            new: true,
            validators: true,
        });
        // if (requestStatus === null) {
        //   return res.status(400).json({
        //     status: 'fail',
        //     message: 'request not created by current user or request not found',
        //   });
        // }
        res.status(201).json({
            status: 'success',
            data: {
                requestStatus,
            },
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
});
exports.updateRequestStatus = updateRequestStatus;
// get resolved requests by support agent in the last 30days
const getResolvedStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const { requestId } = req.params;
        // const requests = await supportRequest.find();
        let today = new Date();
        today.setDate(today.getDate() - 30);
        console.log(today);
        const resolvedRequests = yield supportRequestModel_1.default.find({
            status: 'resolved',
            statusUpdatedAt: { $gte: today },
        });
        console.log(resolvedRequests, '<<<<<<');
        res.status(201).json({
            status: 'success',
            data: {
                resolvedRequests,
            },
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
});
exports.getResolvedStatus = getResolvedStatus;
// if (!requests || resolvedRequests != 'resolved') {
//   return res.status(400).json({
//     status: 'fail',
//     message: 'No request found',
//   });
// }
// if (req.user?.user === 'customer') {
//   return res.status(400).json({
//     status: 'fail',
//     message: 'only a support agent can process request',
//   });
// }
// const requestStatus = await supportRequest.find({
//   date: { $lte: 'today' },
// });
