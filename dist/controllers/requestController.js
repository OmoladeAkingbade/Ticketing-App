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
exports.createSupportRequest = void 0;
const supportRequestModel_1 = __importDefault(require("../model/supportRequestModel"));
const validation_1 = require("../validations/validation");
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
