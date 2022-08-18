import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {
  NotFoundError,
  BadRequestError,
  UnAuthenticatedError,
} from "../errors/index.js";

import {
  hashPassword,
  createJWT,
  comparePassword,
  AddOntime,
  currentTime,
  OtpGen,
} from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { loginDash, registerDash } from "../utils/logger/index.js";

import mailer from "../utils/sendMails.js";
import passport from "passport";
import bcrypt from "bcrypt";
import passportLocal from "passport-local";
import { Console, info } from "console";
var LocalStrategy = passportLocal.Strategy;
// const ac = new AccessControl();
//!Register User
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  //* checking if any one of the field is empty will throw an error
  if (!name || !email || !password) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }

  //checking if user exist
  const userAlreadyExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (userAlreadyExist) {
    throw new BadRequestError("User already exist");
  }

  //encrypting the password
  const newPassword = await hashPassword(password);

  //creating user
  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: newPassword,
      role: role,
    },
  });

  await prisma.EmailSignature.create({
    data: {
      firstName: "Dan",
      lastName: "Daniel",
      founder: "Neil",
      tollNo: 1800012000,
      faxNo: 5555511111,
      emailSig: "dan@gmail.com",
      mobileNo: 9123456789,
      emergencyDetails: "B-21 Washington",
      family: "A",
      work: "Developer",
      userId:newUser.id
    },
  });
  await prisma.UserProfile.create({
    data: {
      firstName: null,
      lastName: null,
      emailProfile: newUser.email,
      title: null,
      contactNo: null,
      faxNo: null,
      facebookUrl: null,
      linkedinUrl: null,
      instagramUrl: null,
      youtubeUrl: null,
      websiteAddress: null,
      tagline: null,
      userProfilePicture: null,
      shortBio: null,
      userId:newUser.id
    },
  });
  // await prisma..create({
  //   data: {
  //     tokenDetails: tokens,
  //     userId: user.id,
  //   },
  // });

  //Generating JWT token but not using it in registration form
  const accessToken = await createJWT(newUser);

  // Generating logs for register dash
  registerDash.log(
    "info",
    `${newUser.name} ,${newUser.password},${newUser.email},Token:${accessToken}`
  );
  res.status(StatusCodes.CREATED).json({
    msg: "signed in successfully",
    newUser,
    accessToken,
    session: req.session,
  });
};

//aleternative creating using Passport ,working on it
passport.use(
  new LocalStrategy((username, password, done) => {
    return next();
    // return done(null, true);
  })
);

//!LOGIN USER
const login = async (req, res) => {
  //* Logical code starts from here
  const { email, password } = req.body;
  if (!email || !password) {
    loginDash.log("error", "Please provide all the values");
    throw new BadRequestError("Please provide all the values");
  }
  
  //checking if user exist in DB
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  //Throwing an error
  if (!user) {
    loginDash.log("error", "User is not registered");
    throw new UnAuthenticatedError("User is not Registered");
  }

  // comparing the password
  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    loginDash.log("error", "Invalid Password");
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  //Generating token for  user to get in dashboard
  const token = await createJWT(user);
  user.password = undefined;
  res.status(StatusCodes.OK).json({
    user,
    token,
  });
  loginDash.log("info", `${user.email},Token:${token}`);
};

//!Sent OTP to Mail
const sentOtpToMail = async (req, res) => {
  const { email } = req.body;

  //If email field is blank then it will throw an error
  if (!email) {
    throw new BadRequestError("User is not registered");
  }

  //Check if email exist in db
  const resetUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      email: true,
      createdAt: true,
      code: true,
      expiryIn: true,
      currentIn: true,
    },
  });

  if (resetUser) {
    const now = new Date();

    //calculating current Time
    var otpCurrentTime = await currentTime(now, 0);

    //Logic for newUSER ,if user is trying to change the password for the first time
    if (!resetUser.code) {
      var otp = await OtpGen(); //Generating Otp
      var otpTime = await currentTime(now, 1); //calculating time for which otp will be valid
    }

    //If user already changed the password and trying for the second time
    if (resetUser.expiryIn < resetUser.currentIn) {
      otpTime = await currentTime(now, 1); //calculating time for which otp will be valid
      otp = await OtpGen();
    }

    const otpData = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        code: otp,
        expiryIn: otpTime,
        currentIn: otpCurrentTime,
      },
      select: {
        id: true,
        email: true,
        code: true,
        expiryIn: true,
        currentIn: true,
      },
    });

    //Sending otp via mail
    await mailer(email, otpData.code);

    //Generating token for reset password
    const token = await createJWT(otpData);
    res.status(StatusCodes.OK).json({
      code: otpData.code,
      token: token,
    });
  }
};

//!Verify otp
const verifyOtp = async (req, res, next) => {
  const { code } = req.body;
  if (!code) {
    throw new BadRequestError("Please enter otp");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });

  if (code == user.code) {
    //  console.log("otp verified");
    res.json("Otp verified");
  } else {
    throw new BadRequestError("Otp not verified");
  }
};

//!Reset Password
const resetPassword = async (req, res) => {
  const { password } = req.body;
  // ac.grant('').extend('writer');
  if (!password) {
    throw new BadRequestError("Please provide password password");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  console.log(user);

  console.log("-----------------");

  const newResetPassword = await hashPassword(password);

  const resetData = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: newResetPassword,
    },
    select: {
      id: true,
      email: true,
      password: true,
      code: true,
      expiryIn: true,
      currentIn: true,
    },
  });
  console.log(resetData);
  res.status(StatusCodes.OK).json({
    msg: "Password changed Sucessfully",
    resetData,
  });
  //  else {
  //   throw new BadRequestError("Try again");
  // }
};
export { register, login, sentOtpToMail, verifyOtp, resetPassword };
