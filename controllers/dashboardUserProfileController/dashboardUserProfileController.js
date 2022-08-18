import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import path from "path";
import {
  NotFoundError,
  BadRequestError,
  UnAuthenticatedError,
} from "../../errors/index.js";

import { StatusCodes } from "http-status-codes";
import { loginDash, registerDash } from "../../utils/logger/index.js";
import multer from "multer";

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "profileImages",
  filename: async (req, file, cb) => {
    console.log("image storage", file);
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const imageProfileUpload = multer({
  storage: imageStorage,
  // limits: {
  //   fileSize: 1000000 // 1000000 Bytes = 1 MB
  // },
  fileFilter(req, file, cb) {
    console.log(file);
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});
//! image Uploader
const imageProfileUploader = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  //const emailContacts ='rama@gmail.co'
  const fileDetails = req.file;
  //  console.log(fileDetails)
  var fullUrl =
    req.protocol +
    "://" +
    req.get("host") +
    req.originalUrl +
    "/" +
    fileDetails.filename;
  //console.log(fullUrl)

 

  await prisma.UserProfile.update({
    where: {
      userId: user.id,
    },
    data: {
      userProfilePicture: fullUrl,
    },
  });
  console.log(fileDetails);
  res.send(fileDetails);

  // res.send(req.file)
};

//!Update email fields
const updateUserProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  if (!user) {
    throw new BadRequestError("user not found");
  }

  const {
    firstName,
    lastName,
    emailProfile,
    title,
    contactNo,
    faxNo,
    facebookUrl,
    linkedinUrl,
    instagramUrl,
    youtubeUrl,
    websiteAddress,
    tagline,
    userProfilePicture,
    shortBio,
  } = req.body;

  const userProfile = await prisma.UserProfile.update({
    where: {
      userId: user.id,
    },
    data: {
      firstName,
      lastName,
      emailProfile,
      title,
      contactNo,
      faxNo,
      facebookUrl,
      linkedinUrl,
      instagramUrl,
      youtubeUrl,
      websiteAddress,
      tagline,
      shortBio,
    },
  });
  res.status(StatusCodes.OK).json({ "Updated Data": userProfile });
};

//!Get single contact
const getUserProfileData = async (req, res) => {
    
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
    });
    const getUserProfile = await prisma.UserProfile.findUnique({
      where: {
      userId:user.id
      }
    });
    res.status(StatusCodes.OK).send(getUserProfile);
  };
  
  export {updateUserProfile,getUserProfileData,imageProfileUploader,imageProfileUpload}
  


