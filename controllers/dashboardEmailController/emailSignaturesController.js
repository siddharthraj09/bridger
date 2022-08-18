import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {
  NotFoundError,
  BadRequestError,
  UnAuthenticatedError,
} from "../../errors/index.js";

import { StatusCodes } from "http-status-codes";
import { loginDash, registerDash } from "../../utils/logger/index.js";

const getEmailSignature = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  if (!user) {
    throw new BadRequestError("user not found");
  }

  const userSignature = await prisma.emailSignature.findUnique({
    where: {
      userId: user.id,
    },
  });
  res.status(StatusCodes.OK).json({ userSignature });
};



//!Update email fields
const updateEmailSignature = async (req, res) => {

 let { id: emailId } = req.params
  emailId=parseInt(emailId)
  const {
    firstName,
    lastName,
    founder,
    tollNo,
    faxNo,
    emailSig,
    mobileNo,
    emergencyDetails,
    family,
    work,
  } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  if (!emailId) {
    throw new BadRequestError("user not found");
  }

  const userSignature = await prisma.emailSignature.update({
    where: {
      userId: emailId,
    },
    data: {
      firstName,
      lastName,
      founder,
      tollNo,
      faxNo,
      emailSig,
      mobileNo,
      emergencyDetails,
      family,
      work,
    },
  });
  res.status(StatusCodes.OK).json({ "Updated Data":userSignature });
};

export { getEmailSignature, updateEmailSignature };
