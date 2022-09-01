import { SetAuthUser } from "./../middlewares/auth";
import { Router, Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/errorHandler";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { ReqQuotes } from "../entity/Quote";
import bcryptjs from "bcryptjs";
import cookie from "cookie";
import catchAsyncError from "../middlewares/catchAsyncError";
import jwt from "jsonwebtoken";
import { authMiddleware, authorizeRoles } from "../middlewares/auth";

// REPOSITIORIES TO DEAL WITH DATABASE
const userRepository = AppDataSource.getRepository(User);
const quotesRespository = AppDataSource.getRepository(ReqQuotes);


// REGISTER ROUTES
const register = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { user } = res.locals;
    if (user) {
      return next(new errorHandler("Invalid Action", 400));
    }
    try {
      const { email, password, name,subscribed } = req.body;
      console.log({ email, password, name,subscribed });
      
      if (!email || !password || !name ) {
        return next(new errorHandler("Please enter Email & Password", 400));
      }
      // CHECK IF EMAIL IS ALREADY REGISTERED OR NOT
      const exist = await userRepository.findOne({ where: { email } });
      if (exist) {
        return next(new errorHandler("This Email is already in use", 400));
      }
      const user = new User();
      user.email = email;
      user.name = name;
      user.password = password;
      user.subscribed = subscribed
      // CHECK IF FIRST TME REGISTERING THEN MAKE ADMIN ELSE USER
      const x = await userRepository.find();
      if (x.length < 1) {
        user.role = "admin";
      }
      // SAVING USER
      await AppDataSource.manager.save(user);
      // UPDATING QUOTES REQUESTED BY THAT USER TO HIS EMAIL TO REGISTERED
      const quotes = await quotesRespository.find({
        where: { userEmail: user.email },
      });
      // UPDATING ALL QUOTES WITH THAT EMAIL
      if (quotes?.length) {
        for (let index = 0; index < quotes.length; ) {
          const quote = quotes[index];
          quote.emailRegistered = true;
          const saved = await quotesRespository.save(quote);
          if (saved) {
            index++;
          }
        }
      }
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.json({ error: "Something went wrong" });
    }
  }
);

// LOGIN ROUTES
const login = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { user } = res.locals;
    if (user) {
      return next(new errorHandler("Invalid Action", 400));
    }
    const { email, password } = req.body;
    // INPUT VALIDATION
    if (!email) return next(new errorHandler("Email cannot be empty", 400));
    if (!password)
      return next(new errorHandler("Password cannot be empty", 400));

    try {
      // CHECK OF EMAIL IS REGISTERED OR NOT
      const user = await userRepository.findOne({
        where: { email },
      });

      if (!user) return next(new errorHandler("User not found", 400));

      // MATCHING PASSWORDS
      const passwordMatches = await bcryptjs.compare(password, user.password);

      if (!passwordMatches) {
        return next(new errorHandler("Password is incorrect", 400));
      }

      // SIGNING TOKENS FOR AUTHENTICATION
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
      // SENDING COOKIES WITH TOKEN
      res.set(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 100000000,
          path: "/",
        })
      );

      return res.json(user);
    } catch (err) {
      console.log(err.message);
      return res.json({ error: "Something went wrong" });
    }
  }
);
// LOGOUT ROUTER
const logout = catchAsyncError((_: Request, res: Response) => {
  // DELETING THE COOKIES WITH TOKEN TO LOGOUT USER
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );

  return res.status(200).json({ success: true });
});
// GET lOGGED IN USER ROUTE
const getUser = catchAsyncError((_: Request, res: Response) => {
  return res.status(200).json(res?.locals.user);
});
// ADMIN ROUTE TO GET ALL USERS
const getAllUsers = catchAsyncError(
  async (_: Request, res: Response, next: NextFunction) => {
    const users = await userRepository.find();
    if (!users?.length) return next(new errorHandler("No Users Found", 400));
    return res
      .status(200)
      .json({ users: users.filter((user) => user.id !== res.locals.user.id) });
  }
);
// USER ROUTES TO CHANGE ACCOUNT PASSOWRD
const changePassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = res.locals.user;
    const { newPassword, oldPassword } = req.body;
    if (newPassword === oldPassword) {
      return next(
        new errorHandler("new and old Passwords cannot be same", 400)
      );
    }

    const user = await userRepository.findOne({
      where: { id },
    });
    if (!user) return next(new errorHandler("User not found", 400));
    const match = await bcryptjs.compare(oldPassword, user?.password);
    if (!match) return next(new errorHandler("Invalid Old Password", 400));
    user.password = await bcryptjs.hash(newPassword, 7);
    await userRepository.save(user);
    return res.status(200).json(user);
  }
);
const changeEmail = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, email } = res.locals.user;
    const { newEmail, oldEmail } = req.body;
    if (!oldEmail || oldEmail !== email) {
      return next(new errorHandler("Invalid Old Email", 400));
    }
    if (!newEmail || newEmail === email)
      return next(new errorHandler("old and new Emails cannot be same", 400));
    const user = await userRepository.findOne({
      where: { id },
    });
    if (!user) return next(new errorHandler("User not found", 400));
    const quotes = await quotesRespository.find({
      where: {
        userEmail: user.email,
      },
    });
    // IF USER CHANGES EMAIL THEN QUOTES EMAIL WILL ALSO BE CHANGED
    if (quotes?.length) {
      for (let index = 0; index < quotes.length; ) {
        const quote = quotes[index];
        quote.userEmail = newEmail;
        quote.emailRegistered = true;
        const saved = await quotesRespository.save(quote);
        if (saved) {
          index++;
        }
      }
    }
    user.email = newEmail;
    await userRepository.save(user);
    return res.status(200).json(user);
  }
);
// ADMIN REMOVE USER ROUTE
const removeUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const found = await userRepository.findOne({ where: { id } });
    if (!found) return next(new errorHandler("User not found", 400));
    const quote = await quotesRespository.find({
      where: { userEmail: found.email },
    });
    // IF USER IS DELETED QUOTES RQEUESTED TO HIM WILL ALSO BE DELETED
    if (quote) {
      await quotesRespository.remove(quote);
    }
    await userRepository.remove(found);
    return res.status(200).json({ success: true });
  }
);

// ADMIN CHANGE USER ROLE
const changeRole = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { role } = req.body;
    if (role !== "admin" && role !== "user") {
      return next(new errorHandler("nvalid Role", 400));
    }
    const found = await userRepository.findOne({ where: { id } });
    if (!found) return next(new errorHandler("User not found", 400));
    found.role = role;
    await userRepository.save(found);
    return res.status(200).json({ success: true, user: found });
  }
);
const router = Router();
// USER ROUTES
router.post("/register", SetAuthUser, register);
router.post("/login", SetAuthUser, login);
router.put("/change_password", SetAuthUser, authMiddleware, changePassword);
router.put("/change_email", SetAuthUser, authMiddleware, changeEmail);

router.post("/logout", SetAuthUser, authMiddleware, logout);
router.get("/getUser", SetAuthUser,authMiddleware, getUser);
// ADMIN ROUTES
router.delete(
  "/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  removeUser
);
router.put(
  "/change_role/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  changeRole
);

router.get(
  "/all",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  getAllUsers
);


export default router;
