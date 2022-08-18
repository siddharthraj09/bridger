import fs from "fs";
import csv from "fast-csv";
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
import { info } from "console";
const uploadCsv = async (req, res) => {
  try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.userId,
        },
      });
      if (!user) {
        throw new BadRequestError("user not found");
      }
     if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
     }
     var newData;
     let csvData = [];
     let path = "file" + "/uploads/" + req.file.filename;
     fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        //  newData = row
        //  return newData
        //console.log(newData)
        csvData.push(row);
        // return row
        // res.status(200).json(row)
      })

      .on("end", async () => {
        console.log(csvData);

        for (let i = 0; i < csvData.length; i++) {
         let firstName = csvData[i].firstName;
          let lastName = csvData[i].lastName;
          let companyName = csvData[i].firstName;
          let designation = csvData[i].designation;
         //   pictureUrl = csvData[i].pictureUrl;
          let emailContacts = csvData[i].emailContacts;
            const emailAlreadyExist =await prisma.ContactsMaster.findUnique({
                where: {
                    emailContacts:emailContacts
                }
            })
         if (emailAlreadyExist){
            console.log("Email Already Exist")
         }
         else{
           await prisma.ContactsMaster.create({
            data: {
              firstName: firstName,
              lastName: lastName,
              companyName: companyName,
              designation: designation,
              pictureUrl: null,
              emailContacts: emailContacts,
              userId: user.id,
       
        }
        // Tutorial.bulkCreate(tutorials)
        // .then((data) => {
        // res.status(200).send({
        //     csvData
        // });
        //   })
        //   .catch((error) => {
        //     res.status(500).send({
        //       message: "Fail to import data into database!",
        //       error: error.message,
        //     });
          });
        }
        
      }
    });
    res.status(200).send({msg:"CsvUploded"});
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
export { uploadCsv };
