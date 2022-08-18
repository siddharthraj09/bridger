// import passport from "passport";
import express from "express";
import auth from "../middleware/authorization.js";
import { login, register ,sentOtpToMail,resetPassword, verifyOtp} from "../controllers/authController.js";
const router = express.Router();
// import { PrismaClient } from "@prisma/client";

// import {
//   NotFoundError,
//   BadRequestError,
//   UnAuthenticatedError,
// } from "../errors/index.js";
// import { hashPassword, createJWT, comparePassword } from "../utils/index.js";
// import { StatusCodes } from "http-status-codes";
// import { loginDash, registerDash } from "../utils/logger/index.js";
// import PassportLocal from "passport-local";

// const prisma = new PrismaClient();

// router.get("/prof", (req, res) => {
//   console.log(req.user);
//   return res.json("working");
// });

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/sentOtpToMail").post(sentOtpToMail);
router.route("/verifyOtp").post(auth,verifyOtp)
router.route("/resetPassword").post(auth,resetPassword)




// router.post("/log", passport.authenticate("local"), async (req, res) => {
//   try {
//     const { email, password } = req.user;

//     console.log("first");
//     // console.log(req.user)
//     res.json(req.user);
//   } catch (error) {
//     if (!email || !password) {
//       loginDash.log("Please provide all the values");
//       throw new BadRequestError("Please provide all the values");
//     }
//     console.log(error);
//   }
// });
export default router;
