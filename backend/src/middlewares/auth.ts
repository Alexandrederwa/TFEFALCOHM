import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { errorHandler } from "../utils/errorHandler";
import catchAsyncError from "./catchAsyncError";
const userRepository = AppDataSource.getRepository(User);

// MIDDLEWARE TO ADD logged in user into res.locals.user
export const SetAuthUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {

    // RECEIVING TOKEN FROM COOKIES
    const { token } = req.cookies;
    if (!token) {
     return next();
    }
    // VERIFING TOKEN
    const decoded = Jwt.verify(
      token,
      String(process.env.JWT_SECRET)
    ) as Jwt.JwtPayload;
    if (!decoded) {
      return next();
    }
    // IF VERIFIED THEN FIND USER
    const user = await userRepository.findOneBy({ id: decoded.id });
    // SETTING USER in RESPONSE
    res.locals.user = user;

    next();
  }
);
// CHECK IF USER IS in RESPONSE OR NOT
export const authMiddleware = catchAsyncError(
  async (_: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;
    console.log(res.locals);
    if (!user) {
      return next(new errorHandler("Please login again", 401));
    }

    return  next();
  }
);

// ROLES MIDDLEWARE TO RESTRICT USER TO PERFORM ADMIN TASKS
export const authorizeRoles = (...roles: string[]) => {
  return (_: Request, res: Response, next: NextFunction) => {
    // "admin".inclues(user.role)
    if (!roles.includes(res.locals.user.role)) {
      return next(
        new errorHandler(
          `Role ${res.locals.user.role} is not allowed to access this route`,
          403
        )
      );
    }
    next();
  };
};
