
import { PrismaClient } from "@prisma/client";
import {
  NotFoundError,
  BadRequestError,
  UnAuthenticatedError,
} from "../errors/index.js";
const prisma = new PrismaClient();
import { hashPassword, createJWT, comparePassword } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { loginDash, registerDash } from "../utils/logger/index.js";

import passport from "passport";
import bcrypt from "bcrypt";
import passportLocal from "passport-local";
var LocalStrategy = passportLocal.Strategy;

//!Register User
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //* checking if any one of the field is empty will throw an error
  if (!name || !email || !password) {
    registerDash.log("info", "Please provide all values");
    throw new BadRequestError("Please provide all values");
  }

  //user already exist
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
    },
  });

  const accessToken = await createJWT(newUser);

  registerDash.log(
    "info",
    `${newUser.name} ,${newUser.password},${newUser.email},Token:${accessToken}`
  );
  res.status(200).json({
    msg: "signed in successfully",
    newUser,
    accessToken,
    session: req.session,
  });
};

passport.use(new LocalStrategy(
  (username, password, done) => {
    return next();
    // return done(null, true);
 
     }))


//!LOGIN USER
const login = async (req, res,next) => {
  passport.authenticate('local', async (err, user, info) => {
    console.log('asdhgasdh')
    return next()
  })
}
    // db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
    //   if (err) { return cb(err); }
    //   if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
      
    //   crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    //     if (err) { return cb(err); }
    //     if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
    //       return cb(null, false, { message: 'Incorrect username or password.' });
    //     }
    //     return cb(null, row);
      // });
    // });
//   }));

// }
//   // console.log('login')
  // // res.json("hi")
  // // return true;
  // return passport.use(
  //   new LocalStrategy((username, password, done)=>{
  //     console.log("step 1");
  //     const user = prisma.user.findUnique({where: {
  //       email:username,
  //     }},);
  //     console.log("step 2");
  //     res.json(user);

  //   })
  // )
  // passport.use(
  //   new LocalStrategy((username, password, done) => {
  //     const user = prisma.user.findUnique({
  //       where: {
  //         email: username,
  //       },
  //     });
  //     return done(null, user);

  //     findUser(username, (err, user) => {
  //       if (err) {
  //         return done(err);
  //       }

  //       // User not found
  //       if (!user) {
  //         return done(null, false);
  //       }

  //       // Always use hashed passwords and fixed time comparison
  //       bcrypt.compare(password, user.passwordHash, (err, isValid) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         if (!isValid) {
  //           return done(null, false);
  //         }
  //         return done(null, user);
  //       });
  //     });
  //   })
  // );


  //* Logical code starts from here
  // const { email, password } = req.body;
  // if (!email || !password) {
  //   loginDash.log("Please provide all the values");
  //   throw new BadRequestError("Please provide all the values");
  // }
  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: email,
  //   },
  //   select: {
  //     email: true,
  //     password: true,
  //   },
  // });
  // if (!user) {
  //   loginDash.log("Invalid Credentials");
  //   throw new UnAuthenticatedError("Invalid Credentials");
  // }
  // //console.log(user)

  // const isPasswordCorrect = await comparePassword(password, user.password);
  // if (!isPasswordCorrect) {
  //    loginDash.log('Invalid Credentials')
  //   throw new UnAuthenticatedError("Invalid Credentials");
  // }
  // const token = await createJWT(user);
  // user.password = undefined;
  // res.status(StatusCodes.OK).json({
  //   user,
  //   token,
  // });
  // loginDash.log("info", `${user.email},Token:${token}`);
// };

export { register, login };




//------------------------------------------------------------------------------------------------------------------------//




//logical working code for login and register author siddharth raj

import { PrismaClient } from "@prisma/client";
import {
  NotFoundError,
  BadRequestError,
  UnAuthenticatedError,
} from "../errors/index.js";
const prisma = new PrismaClient();
import { hashPassword, createJWT, comparePassword } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { loginDash, registerDash } from "../utils/logger/index.js";

import passport from "passport";
import bcrypt from "bcrypt";
import passportLocal from "passport-local";
var LocalStrategy = passportLocal.Strategy;


passport.use(new LocalStrategy(
  (username, password, done) => {
     console.log("step 1")
    // return done(null, true);
 
     }))


//!LOGIN USER
const login = async (req, res,next) => {
  console.log("step 2")
  passport.authenticate('local', async (err, user, info) => {
    console.log('asdhgasdh')
    return next()
  })
}
export { login };
