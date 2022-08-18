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
  destination: "images",
  filename: async (req, file, cb) => {
    console.log("image storage",file)
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const imageUpload = multer({
  storage: imageStorage,
  // limits: {
  //   fileSize: 1000000 // 1000000 Bytes = 1 MB
  // },
  fileFilter(req, file, cb) {
    console.log(file)
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});
//! image Uploader
const imageUploader = async (req, res) => {
  const {emailContacts} = req.body;
     //const emailContacts ='rama@gmail.co'
     const fileDetails = req.file;
   //  console.log(fileDetails)
     var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl+"/" +fileDetails.filename;
     //console.log(fullUrl)
   
  console.log(emailContacts);
  
  await prisma.contactsMaster.update({
    where: {
      emailContacts: emailContacts,
    },
    data: {
      pictureUrl: fullUrl,
    },
  });
  console.log(fileDetails);
  res.send(
     fileDetails
  );

  // res.send(req.file)
};
//!Create all contacts
const createContacts = async (req, res) => {
  const {
    firstName,
    lastName,
    companyName,
    designation,
    pictureUrl,
    emailContacts,
    officeNo,
    tollfreeNumber,
    mobileNo,
    leadOwner,
    sequenceStatus,
  } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  if (!user) {
    throw new BadRequestError("user not found");
  }

  // const userAlreadyExist= await prisma.emailContacts.findUnique({
  //   where: {
  //       emailContacts:emailContacts
  //   },
  // });
  // if (userAlreadyExist) {
  //   throw new BadRequestError("Contact already exist");
  // }

  const userContacts = await prisma.ContactsMaster.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      designation: designation,
      pictureUrl: null,
      emailContacts: emailContacts,
      contactssub: {
        create: [
          {
            officeNo: officeNo,
            tollfreeNumber: tollfreeNumber,
            mobileNo: mobileNo,
            leadOwner: leadOwner,
            sequenceStatus: sequenceStatus,
          },
        ],
      },
      userId: user.id,
    },
    include: {
      contactssub: true,
    },
  });

  res.status(StatusCodes.OK).json({ "Single contact data": userContacts });
};

//!Get single contact
const getSingleContacts = async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  console.log(id);
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  const contactsMaster = await prisma.ContactsMaster.findMany({
    where: {
      id: id,
      userId: user.id,
    },
    include: {
      contactssub: true,
    },
  });
  res.status(StatusCodes.OK).send(contactsMaster);
};

//!Get all contacts by particular user
const getAllContacts = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  if (!user) {
    throw new BadRequestError("user not found");
  }
  const contactsMaster = await prisma.ContactsMaster.findMany({
    where: {
      userId: req.user.userId,
    },
    include: {
      contactssub: true,
    },
  });
  // const contactsSubmaster = await prisma.ContactsSub.findMany();
  res.status(StatusCodes.OK).send(contactsMaster);
};

//!Update single contact
const updateSingleContact = async (req, res) => {
  let { id: commonId } = req.params;
  commonId = parseInt(commonId);
  console.log(commonId);
  const {
    firstName,
    lastName,
    companyName,
    designation,
    pictureUrl,
    emailContacts,
    officeNo,
    tollfreeNumber,
    mobileNo,
    leadOwner,
    sequenceStatus,
  } = req.body;

  if (!commonId) {
    throw new BadRequestError("Please provide the id");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  const userContact = await prisma.contactsMaster.findUnique({
    where: {
      id: commonId,
    },
  });
 // console.log(user.id)
  if (user.id == userContact.userId) {
    const updateAll = await prisma.contactsMaster.update({
      where: {
        id: commonId,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        companyName: companyName,
        designation: designation,
        emailContacts: emailContacts,
        contactssub: {
          updateMany: {
            where: {
              masterUserId: commonId,
            },
            data: {
              officeNo: officeNo,
              tollfreeNumber: tollfreeNumber,
              mobileNo: mobileNo,
              leadOwner: leadOwner,
              sequenceStatus: sequenceStatus,
            },
          },
        },
      },
    });
    res.status(StatusCodes.OK).send(updateAll);
  }

  
};


//!Update single contact SequenceStatus
const updateSingleContactSequenceStatus = async (req, res) => {
  let { id: masterContactId } = req.params;
  masterContactId = parseInt(masterContactId);
  console.log(masterContactId);
  const {
    sequenceStatus
  } = req.body;

  if (!masterContactId) {
    throw new BadRequestError("Please provide the id");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  const userContact = await prisma.contactsMaster.findUnique({
    where: {
      id: masterContactId,
    },
  });
 // console.log(user.id)
  if (user.id == userContact.userId) {
    const updateSequenceStatus = await prisma.contactsSub.updateMany({
      where: {
        masterUserId: masterContactId,
      },
      data: {
        sequenceStatus: sequenceStatus,
        },
      
    });
    const status = await prisma.contactsSub.findFirst({
      where: {
        masterUserId: masterContactId,
      }
     
    });
    res.status(StatusCodes.OK).send(status);
  }

  
};


export {
  getAllContacts,
  createContacts,
  imageUpload,
  imageUploader,
  getSingleContacts,
  updateSingleContact,
  updateSingleContactSequenceStatus
};
