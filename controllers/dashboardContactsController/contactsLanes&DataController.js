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

const createLanesContacts = async (req, res) => {
  const {
    origin,
    destination,
    commodity,
    equipment,
    weight,
    loading,
    volume,
    tl,
    cost,
charge,
    specialreq,
  } = req.body;

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
  //   console.log(user.contactssub[0].masterUserId)
  const subContactId = user.contactssub[0].id;

  // const userAlreadyExist= await prisma.emailContacts.findUnique({
  //   where: {
  //       emailContacts:emailContacts
  //   },
  // });
  // if (userAlreadyExist) {
  //   throw new BadRequestError("Contact already exist");
  // }

  const userContacts = await prisma.LanesData.create({
    data: {
      origin,
      destination,
      commodity,
      equipment,
      weight,
      loading,
      volume,
      tl,
      specialreq,
      cost,
      charge,
      subcontactsUserId: subContactId,
    },
  });

  res.status(StatusCodes.OK).json({ LanesData: userContacts });
};

//!Get lanes contact
const getLanesContacts = async (req, res) => {
  let { id:masterContactId } = req.params;
  masterContactId = parseInt(masterContactId);
  console.log(masterContactId);
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  const laneData = await prisma.ContactsMaster.findMany({
    where: {
      id: masterContactId,
      userId: user.id,
    },
    include: {
      contactssub: {
        include: {
          lanesdata: true,
        },
      },
    },
  });
  res.status(StatusCodes.OK).send(laneData);
};

//!Delete single lane data

const  deleteLanesContacts = async(req, res)=>{
    let { id :laneId } = req.params;
    laneId = parseInt(laneId);
    const deleteUser = await prisma.LanesData.delete({
        where: {
            id :laneId ,
        },
      })
      res.status(StatusCodes.OK).send('Deleted Sucessfully')
}


export { createLanesContacts,getLanesContacts,deleteLanesContacts};
