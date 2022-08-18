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

const createAppointment = async (req, res) => {
  const {
    meetingDate,
      achievement, 
      primaryObjective, 
      secondaryObjective,  
      meetingDateTime, 
     // meetingTime,
   
  } = req.body;
 

  let { masterContactId } = req.body;
  masterContactId = parseInt(masterContactId);
  const user = await prisma.contactsMaster.findUnique({
    where: {
      id: masterContactId,
    },
    include: {
      contactssub:  {
        include: {
          meetinglist: true,
        },
      },
    },
  });
  if (!user) {
    throw new BadRequestError("user not found");
  }
  console.log(user);
  console.log(user.contactssub[0].masterUserId);
  const subContactId = user.contactssub[0].id;
  const meetingList = user.contactssub[0].meetinglist;

 
  // const userContacts = await prisma.MeetingList.findUnique({
  //   data: {
  //     subcontactsUserId: subContactId,
  //   },
  // });

  
  function checkSame(date1, date2) {
    return moment(date1).isSame(date2);
  }

  if(meetingList == null ){
    const newmeeting = await prisma.meetingList.create({
      data: {
        subcontactsUserId: subContactId,
        achievement,
        primaryObjective,
        secondaryObjective,
        meetingDateTime, 
        meetingDate
      //  meetingTime
      }
    })
    console.log(' newMeeting', newmeeting)
    res.status(200).send({data: newmeeting})
  }
 // console.log("meetingTime", meetingTime)
  const appointmentBooked= await prisma.meetingList.findFirst({
    where: {  meetingDateTime: meetingDateTime, subcontactsUserId: subContactId}
  })
  console.log("appointmentBooked", appointmentBooked)
  if(appointmentBooked){
    const meetingBooked =  checkSame(appointmentBooked.meetingDateTime, new Date(meetingDateTime))
    console.log(meetingBooked)

   // console.log("appointmentBooked:-", appointmentBooked.meetingTime)
    //console.log("meetingTime", meetingTime)
    if(meetingBooked==true ){
      res.status(201).send("user already meeting Booked")
    }
  }
  else{
    const newmeeting = await prisma.meetingList.create({
      data: {
        subcontactsUserId: subContactId,
        achievement,
        primaryObjective,
        secondaryObjective,
        meetingDateTime, 
        meetingDate
        // meetingTime
      }
    })
    console.log('Created new artist: ', newmeeting)
    res.status(200).send({data: newmeeting})
  }


};

export{createAppointment}