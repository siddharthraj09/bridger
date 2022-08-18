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

const getAllNoAppointment = async (req, res) => {
  // let { id:masterContactId } = req.params;
  // masterContactId = parseInt(masterContactId);
  // console.log(masterContactId);
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  let currentDate = moment().format("YYYY-MM-DD");
  const allNoAppointment = await prisma.ContactsMaster.findMany({
    where: {
      userId: user.id,
      //   contactssub:{
      //     meetinglist :empty
      //   }
    },
    include: {
      contactssub: {
        include: {
          meetinglist: true,
        },
      },
    },
  });

  const noAppoint = async (allNoAppointment) => {
  //  console.log(allNoAppointment)
    let result = allNoAppointment;
    let allMeeting = [];
    for (let i = 0; i <= result.length - 1; i++) {
      let contactssub = result[i].contactssub;
      for (let j = 0; j <= contactssub.length - 1; j++) {
        let meetinglist = contactssub[j].meetinglist;
        if (meetinglist.length == 0) {
          allMeeting.push(result[i]);
        }
        //     for(let k=0; k<=meetinglist.length-1; k++){
        //       allMeeting.push(meetinglist[k])
        //     //   for(let l=0; l<=allMeeting.length-1; l++){
        //     //     allMeeting[l].masterId = result[i].contactssub[0].masterUserId
        //     //     allMeeting[l].firstName = result[i].firstName
        //     //     allMeeting[l].lastName = result[i].lastName
        //     //     allMeeting[l].companyName = result[i].companyName
        //     //     allMeeting[l].designation = result[i].designation
        //     //     allMeeting[l].pictureUrl = result[i].pictureUrl
        //     //   };
        //   }
      }

    }
    console.log("allMeetingList-", allMeeting);
    return allMeeting;
  };
  if(allNoAppointment){
    const ans = await noAppoint(allNoAppointment)
    res.status(200).send(ans);
  }

 
};

export { getAllNoAppointment };
