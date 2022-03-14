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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const memoryServer_1 = require("../database/memoryServer");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, memoryServer_1.connectMemoryServer)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, memoryServer_1.cleanUpMemoryServer)();
}));
let token;
// test authentication(signup and login)
describe('user authentication', () => {
    it('it should create an account for a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            email: 'adele@gmail.com',
            password: 'adelepassword',
            fullname: 'Adele Ilenz',
        };
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/v1/users/signup').send(data);
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data.email).toBe(data.email);
        expect(response.body.data.fullname).toBe(data.fullname);
        expect(response.body).toHaveProperty('token');
    }));
    //   test login
    it('it should log the user into the application', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            email: 'adele@gmail.com',
            password: 'adelepassword',
        };
        const response = yield (0, supertest_1.default)(app_1.default).post('/api/v1/users/login').send(data);
        token = response.body.token;
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data.email).toBe(data.email);
        expect(response.body).toHaveProperty('token');
    }));
});
