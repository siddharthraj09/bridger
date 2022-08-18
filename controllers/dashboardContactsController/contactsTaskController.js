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
//! Create  Task
const createTasksContacts = async (req, res) => {
  const { taskData } = req.body;

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

  const userContacts = await prisma.Tasks.create({
    data: {
      taskData,
      subcontactsUserId: subContactId,
    },
  });

  res.status(StatusCodes.OK).json({ data: userContacts });
};

//!Get Notes contacts
const getTasksContacts = async (req, res) => {
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
            tasks: true,
        },
      },
    },
  });
  res.status(StatusCodes.OK).send(notesData);
};

//!Update Single Challenge

const updateTasksContacts = async (req, res) => {
  const { taskData } = req.body;
  let { id: tasksId } = req.params;
  tasksId = parseInt(tasksId);

  const userContacts = await prisma.Tasks.update({
    where:{id:tasksId},
    data: {
      taskData,
     
    },
  });

  res.status(StatusCodes.OK).json({ data: userContacts });
};

//!Delete single note
const deleteTaskContacts = async (req, res) => {
    let { id: tasksId } = req.params;
    tasksId = parseInt(tasksId);
  const deleteUser = await prisma.Tasks.delete({
    where: {
      id: tasksId,
    },
  });
  res.status(StatusCodes.OK).send("Deleted Sucessfully");
};
export {
  createTasksContacts,
  getTasksContacts,
  deleteTaskContacts,
  updateTasksContacts
};
