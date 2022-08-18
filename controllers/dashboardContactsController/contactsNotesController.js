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
//!Create Notes
const createNotesContacts   = async (req, res) => {

    const {notesData } = req.body;
    
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
        console.log(user.contactssub[0].masterUserId)
      const subContactId = user.contactssub[0].id;
    
      // const userAlreadyExist= await prisma.emailContacts.findUnique({
      //   where: {
      //       emailContacts:emailContacts
      //   },
      // });
      // if (userAlreadyExist) {
      //   throw new BadRequestError("Contact already exist");
      // }
    
      const userContacts = await prisma.Notes.create({
        data: {
            notesData,
          subcontactsUserId: subContactId,
        },
      });
    
      res.status(StatusCodes.OK).json({ data: userContacts });

}

//!Get Notes contacts
const getNotesContacts = async (req, res) => {
    let { id:masterContactId } = req.params;
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
            notes: true,
          },
        },
      },
    });
    res.status(StatusCodes.OK).send(notesData);
  };

  //!Delete signle note
const  deleteNotesContacts = async(req, res)=>{
    let { id :notesId } = req.params;
    notesId = parseInt(notesId);
    const deleteUser = await prisma.Notes.delete({
        where: {
            id :notesId ,
        },
      })
      res.status(StatusCodes.OK).send('Deleted Sucessfully')
}
export{createNotesContacts,getNotesContacts,deleteNotesContacts}