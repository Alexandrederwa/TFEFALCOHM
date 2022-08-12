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
exports.authorizeRoles = exports.SetAuthUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const errorHandler_1 = require("../utils/errorHandler");
const catchAsyncError_1 = __importDefault(require("./catchAsyncError"));
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
exports.SetAuthUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    if (!token) {
        return next();
    }
    const decoded = jsonwebtoken_1.default.verify(token, String(process.env.JWT_SECRET));
    if (!decoded) {
        return next();
    }
    const user = yield userRepository.findOneBy({ id: decoded.id });
    console.log(user);
    console.log("tg");
    res.locals.user = user;
    next();
}));
const authorizeRoles = (...roles) => {
    return (_, res, next) => {
        if (!roles.includes(res.locals.user.role)) {
            return next(new errorHandler_1.errorHandler(`Role ${res.locals.user.role} is not allowed to access this route`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=auth.js.map