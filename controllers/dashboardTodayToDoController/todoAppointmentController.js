import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import path from "path";
import moment from "moment";

import {
  NotFoundError,
  BadRequestError,
  UnAuthenticatedError,
} from "../../errors/index.js";

import { StatusCodes } from "http-status-codes";
import { loginDash, registerDash } from "../../utils/logger/index.js";


const getAllApointment = async (req, res) => {
  // let { id:masterContactId } = req.params;
  // masterContactId = parseInt(masterContactId);
  // console.log(masterContactId);
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  let currentDate=moment().format('YYYY-MM-DD')
  const allAppointment = await prisma.ContactsMaster.findMany({
    where: {
      userId: user.id,
     
      
    },
    include: {
      contactssub: {
        include: {
          meetinglist:{
            where:{
              meetingDate:currentDate
            }
          }
        },
      },
    },
  });


  // let allMeeting = [];
  // for  (let i = 0; i <= allAppointment.length - 1; i++) {
  //   let contactssub = allAppointment[i].contactssub;
  //   let MasterId = allAppointment[i].contactssub[0].masterUserId;
  //   // console.log(MasterId)
  //   for (let j = 0; j <= contactssub.length - 1; j++) {
  //     let meetinglist = contactssub[j].meetinglist;
  //    // console.log(meetinglist);
  //     if (meetinglist.length === 0) {
  //       return;
  //     } else {
  //       for (let k = 0; k <= meetinglist.length - 1; k++) {
  //         //meetinglist[k].unshift( MasterId);
  //         allMeeting.push(meetinglist[k]);
  //         allMeeting.unshift(MasterId)
  //       }
  //     }
  //   }
  // }
 //  console.log(allMeeting)
  res.status(200).send(allAppointment);
};

const postSingleApointment = async(req, res) => {
  const{achievement,
    companyName,
    designation,
    firstName,
    id,
    lastName,
    
    meetingDate,
    meetingDateTime,
    pictureUrl,
    primaryObjective,
    secondaryObjective,
    subcontactsUserId} = req.body

    let {masterId} =req.body
    masterId = Number(masterId)
    const result ={achievement,
  companyName,
  designation,
  firstName,
  id,
  lastName,
  masterId,
  meetingDate,
  meetingDateTime,
  pictureUrl,
  primaryObjective,
  secondaryObjective,
  subcontactsUserId}

  res.status(200).send(result)


}

export { getAllApointment,postSingleApointment };
