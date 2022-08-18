import express from "express";
const app = express();
import dotenv from "dotenv";
import "express-async-errors";
dotenv.config();
import morgan from "morgan";
import  session from "express-session";
import flash from 'connect-flash'
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client'
const prisma =new PrismaClient()
// import passport from "passport";
import auth from "./middleware/authorization.js";
import cookieParser  from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'
//middleware
import authRouter from "./routes/authRouter.js";
import dashboardRouter from "./routes/dashboardRouter.js"
import  './config/passport.js'

//errors
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";


app.use(morgan("dev"));

app.use(express.json());
app.use(cors())
app.set('trust proxy', 1) // trust first proxy

 app.use(cookieParser())

 
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)
// Express session
app.use(
  session({
    cookie: {
     maxAge: 1000 * 60 * 60 * 24// ms
    },
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);


// // Passport   
// import  './config/passport.js'
// app.use(passport.initialize());
// app.use(passport.session());

// Connect flash
app.use(flash()); 

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.get("/api/v1/auth", (req, res) => {
  // res.send("welcome to express");
});
// Virtual Path Prefix '/static'
app.use('/api/v1/dashboard/createContacts/uploadImage', express.static('images'))
app.use('/api/v1/dashboard/updateUserProfile/uploadImage', express.static('profileImages'))


app.use("/api/v1/auth", authRouter);
app.use('/api/v1/dashboard',auth,dashboardRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = () => {
  try {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    // dash.error(`Error : ${error},Request : ${req.originalUrl}`);
    // res.render("400");
  }
};
start();


