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
const auth_1 = require("./../middlewares/auth");
const express_1 = require("express");
const errorHandler_1 = require("../utils/errorHandler");
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const Quote_1 = require("../entity/Quote");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cookie_1 = __importDefault(require("cookie"));
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_2 = require("../middlewares/auth");
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const quotesRespository = data_source_1.AppDataSource.getRepository(Quote_1.ReqQuotes);
const register = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    if (user) {
        return next(new errorHandler_1.errorHandler("Invalid Action", 400));
    }
    try {
        const { email, password, name, subscribed } = req.body;
        console.log({ email, password, name, subscribed });
        if (!email || !password || !name) {
            return next(new errorHandler_1.errorHandler("Please enter Email & Password", 400));
        }
        const exist = yield userRepository.findOne({ where: { email } });
        if (exist) {
            return next(new errorHandler_1.errorHandler("This Email is already in use", 400));
        }
        const user = new User_1.User();
        user.email = email;
        user.name = name;
        user.password = password;
        user.subscribed = subscribed;
        const x = yield userRepository.find();
        if (x.length < 1) {
            user.role = "admin";
        }
        yield data_source_1.AppDataSource.manager.save(user);
        const quotes = yield quotesRespository.find({
            where: { userEmail: user.email },
        });
        if (quotes === null || quotes === void 0 ? void 0 : quotes.length) {
            for (let index = 0; index < quotes.length;) {
                const quote = quotes[index];
                quote.emailRegistered = true;
                const saved = yield quotesRespository.save(quote);
                if (saved) {
                    index++;
                }
            }
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" });
    }
}));
const login = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    if (user) {
        return next(new errorHandler_1.errorHandler("Invalid Action", 400));
    }
    const { email, password } = req.body;
    if (!email)
        return next(new errorHandler_1.errorHandler("Email cannot be empty", 400));
    if (!password)
        return next(new errorHandler_1.errorHandler("Password cannot be empty", 400));
    try {
        const user = yield userRepository.findOne({
            where: { email },
        });
        if (!user)
            return next(new errorHandler_1.errorHandler("User not found", 400));
        const passwordMatches = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatches) {
            return next(new errorHandler_1.errorHandler("Password is incorrect", 400));
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET);
        res.set("Set-Cookie", cookie_1.default.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 100000000,
            path: "/",
        }));
        return res.json(user);
    }
    catch (err) {
        console.log(err.message);
        return res.json({ error: "Something went wrong" });
    }
}));
const logout = (0, catchAsyncError_1.default)((_, res) => {
    res.set("Set-Cookie", cookie_1.default.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
    }));
    return res.status(200).json({ success: true });
});
const getUser = (0, catchAsyncError_1.default)((_, res) => {
    return res.status(200).json(res === null || res === void 0 ? void 0 : res.locals.user);
});
const getAllUsers = (0, catchAsyncError_1.default)((_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userRepository.find();
    if (!(users === null || users === void 0 ? void 0 : users.length))
        return next(new errorHandler_1.errorHandler("No Users Found", 400));
    return res
        .status(200)
        .json({ users: users.filter((user) => user.id !== res.locals.user.id) });
}));
const changePassword = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = res.locals.user;
    const { newPassword, oldPassword } = req.body;
    if (newPassword === oldPassword) {
        return next(new errorHandler_1.errorHandler("new and old Passwords cannot be same", 400));
    }
    const user = yield userRepository.findOne({
        where: { id },
    });
    if (!user)
        return next(new errorHandler_1.errorHandler("User not found", 400));
    const match = yield bcryptjs_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!match)
        return next(new errorHandler_1.errorHandler("Invalid Old Password", 400));
    user.password = yield bcryptjs_1.default.hash(newPassword, 7);
    yield userRepository.save(user);
    return res.status(200).json(user);
}));
const changeEmail = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, email } = res.locals.user;
    const { newEmail, oldEmail } = req.body;
    if (!oldEmail || oldEmail !== email) {
        return next(new errorHandler_1.errorHandler("Invalid Old Email", 400));
    }
    if (!newEmail || newEmail === email)
        return next(new errorHandler_1.errorHandler("old and new Emails cannot be same", 400));
    const user = yield userRepository.findOne({
        where: { id },
    });
    if (!user)
        return next(new errorHandler_1.errorHandler("User not found", 400));
    const quotes = yield quotesRespository.find({
        where: {
            userEmail: user.email,
        },
    });
    if (quotes === null || quotes === void 0 ? void 0 : quotes.length) {
        for (let index = 0; index < quotes.length;) {
            const quote = quotes[index];
            quote.userEmail = newEmail;
            quote.emailRegistered = true;
            const saved = yield quotesRespository.save(quote);
            if (saved) {
                index++;
            }
        }
    }
    user.email = newEmail;
    yield userRepository.save(user);
    return res.status(200).json(user);
}));
const removeUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const found = yield userRepository.findOne({ where: { id } });
    if (!found)
        return next(new errorHandler_1.errorHandler("User not found", 400));
    const quote = yield quotesRespository.find({
        where: { userEmail: found.email },
    });
    if (quote) {
        yield quotesRespository.remove(quote);
    }
    yield userRepository.remove(found);
    return res.status(200).json({ success: true });
}));
const changeRole = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    if (role !== "admin" && role !== "user") {
        return next(new errorHandler_1.errorHandler("nvalid Role", 400));
    }
    const found = yield userRepository.findOne({ where: { id } });
    if (!found)
        return next(new errorHandler_1.errorHandler("User not found", 400));
    found.role = role;
    yield userRepository.save(found);
    return res.status(200).json({ success: true, user: found });
}));
const router = (0, express_1.Router)();
router.post("/register", auth_1.SetAuthUser, register);
router.post("/login", auth_1.SetAuthUser, login);
router.put("/change_password", auth_1.SetAuthUser, auth_2.authMiddleware, changePassword);
router.put("/change_email", auth_1.SetAuthUser, auth_2.authMiddleware, changeEmail);
router.post("/logout", auth_1.SetAuthUser, auth_2.authMiddleware, logout);
router.get("/getUser", auth_1.SetAuthUser, getUser);
router.delete("/:id", auth_1.SetAuthUser, auth_2.authMiddleware, (0, auth_2.authorizeRoles)("admin"), removeUser);
router.put("/change_role/:id", auth_1.SetAuthUser, auth_2.authMiddleware, (0, auth_2.authorizeRoles)("admin"), changeRole);
router.get("/all", auth_1.SetAuthUser, auth_2.authMiddleware, (0, auth_2.authorizeRoles)("admin"), getAllUsers);
exports.default = router;
//# sourceMappingURL=auth.js.map