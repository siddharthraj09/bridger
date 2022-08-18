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
import PassportLocal from 'passport-local'
import passport from "passport";


passport.serializeUser((user,done) => done(null,user))
passport.deserializeUser((user,done)=>done(null,user) )

passport.use( new PassportLocal.Strategy({
    usernameField:'email',
    session:false
  },async (email,password ,done) =>{
    try {
      console.log('secooond')
      if (!email || !password) {
        loginDash.log("Please provide all the values");
        throw new BadRequestError("Please provide all the values");
      }
      const userFound = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          email: true,
          password: true,
        },
      });
      if(userFound && comparePassword(userFound.password,password)){
        
        done (null,userFound)
      }
      
    } catch (error) {
      done(error)
    }
    
  }))
