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
//! Create  Challenges
const createChallengesContacts = async (req, res) => {
  const { challengesData } = req.body;

  let { masterContactId } = req.body;
  masterContactId = parseInt(masterContactId);
  const user = await prisma.contactsMaster.findUnique({
    where: {
      id: masterContactId,
    },
    include: {
      contactssub: true,
    },
  });
  if (!user) {
    throw new BadRequestError("user not found");
  }
  console.log(user);
  console.log(user.contactssub[0].masterUserId);
  const subContactId = user.contactssub[0].id;

  // const userAlreadyExist= await prisma.emailContacts.findUnique({
  //   where: {
  //       emailContacts:emailContacts
  //   },
  // });
  // if (userAlreadyExist) {
  //   throw new BadRequestError("Contact already exist");
  // }

  const userContacts = await prisma.Challenges.create({
    data: {
      challengesData,
      subcontactsUserId: subContactId,
    },
  });

  res.status(StatusCodes.OK).json({ data: userContacts });
};

//!Get Notes contacts
const getChallengesContacts = async (req, res) => {
  let { id: masterContactId } = req.params;
  masterContactId = parseInt(masterContactId);
  console.log(masterContactId);
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  const notesData = await prisma.ContactsMaster.findMany({
    where: {
      id: masterContactId,
      userId: user.id,
    },
    include: {
      contactssub: {
        include: {
          challenges: true,
        },
      },
    },
  });
  res.status(StatusCodes.OK).send(notesData);
};

//!Update Single Challenge

const updateChallengesContacts = async (req, res) => {
  const { challengesData } = req.body;
  let { id: challengesId } = req.params;
  challengesId = parseInt(challengesId);

  const userContacts = await prisma.Challenges.update({
    where:{id:challengesId},
    data: {
      challengesData,
     
    },
  });

  res.status(StatusCodes.OK).json({ data: userContacts });
};

//!Delete single note
const deleteChallengesContacts = async (req, res) => {
  let { id: challengesId } = req.params;
  challengesId = parseInt(challengesId);
  const deleteUser = await prisma.challenges.delete({
    where: {
      id: challengesId,
    },
  });
  res.status(StatusCodes.OK).send("Deleted Sucessfully");
};
export {
  createChallengesContacts,
  getChallengesContacts,
  deleteChallengesContacts,
  updateChallengesContacts
};
