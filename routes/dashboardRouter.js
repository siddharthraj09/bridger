import express from "express";
const router = express.Router();
import path from "path";
import multer from "multer";

import {
  gmailAPIPermission,
  gmailAPIToken,
  gmailAPIEmailSend,
  gmailAPIEmailRead,
  gmailAPICalender,
  gmailAPICreateEventCalender,
  gmailAPIUpdateEventCalender,
} from "../controllers/dashboardEmailController/gmailController.js";
import {
  getEmailSignature,
  updateEmailSignature,
} from "../controllers/dashboardEmailController/emailSignaturesController.js";
import {
  getAllContacts,
  createContacts,
  imageUpload,
  imageUploader,
  getSingleContacts,
  updateSingleContact,
  updateSingleContactSequenceStatus,
} from "../controllers/dashboardContactsController/contactsController.js";
import {
  updateUserProfile,
  getUserProfileData,
  imageProfileUploader,
  imageProfileUpload,
} from "../controllers/dashboardUserProfileController/dashboardUserProfileController.js";
import {
  createLanesContacts,
  getLanesContacts,
  deleteLanesContacts,
} from "../controllers/dashboardContactsController/contactsLanes&DataController.js";

import {
  createNotesContacts,
  getNotesContacts,
  deleteNotesContacts,
} from "../controllers/dashboardContactsController/contactsNotesController.js";
import { createAppointment } from "../controllers/dashboardContactsController/contactsAppointmentController.js";
import {
  getAllApointment,
  postSingleApointment,
} from "../controllers/dashboardTodayToDoController/todoAppointmentController.js";

import {
  createChallengesContacts,
  getChallengesContacts,
  deleteChallengesContacts,
  updateChallengesContacts,
} from "../controllers/dashboardContactsController/contactsChallengesController.js";

import {
  createTasksContacts,
  getTasksContacts,
  deleteTaskContacts,
  updateTasksContacts,
} from "../controllers/dashboardContactsController/contactsTaskController.js";

import { createZoomUser } from "../controllers/dashboardEmailController/zoomController.js";
import {uploadCsv} from '../controllers/dashboardContactsController/contactsCsvController.js'
import {uploadFile} from "../middleware/upload.js";
import { getAllNoAppointment } from "../controllers/dashboardTodayToDoController/todoProspectingNoContactController.js";

import { getAuthUrl } from "../controllers/dashboardEmailController/outllokControllerNew.js";

//!upload CSV
router.route("/uploadCsv").post(uploadFile.single("file"), uploadCsv);

//!Contacts Details
router.route("/getSingleContacts/:id").get(getSingleContacts);
router.route("/getAllContacts").get(getAllContacts);
router.route("/createContacts").post(createContacts);
router.route("/updateSingleContact/:id").patch(updateSingleContact);
router
  .route("/updateSingleContactSequenceStatus/:id")
  .patch(updateSingleContactSequenceStatus);

router.post(
  "/createContacts/uploadImage",
  imageUpload.single("image"),
  imageUploader
);
//!User Profile
router.route("/getUserProfileData").get(getUserProfileData);
router.route("/updateUserProfile").patch(updateUserProfile);
router.post(
  "/updateUserProfile/uploadImage",
  imageProfileUpload.single("image"),
  imageProfileUploader
);

//!Contact lanesdata
router.route("/createLanesContacts").post(createLanesContacts);
getLanesContacts;
router.route("/getLanesContacts/:id").get(getLanesContacts);
router.route("/deleteLanesContacts/:id").delete(deleteLanesContacts);

//!Contact Notes data
router.route("/createNotesContacts").post(createNotesContacts);
router.route("/getNotesContacts/:id").get(getNotesContacts);
router.route("/deleteNotesContacts/:id").delete(deleteNotesContacts);
//!Contacts Create Appointment
router.route("/createAppointment").post(createAppointment);
// router.route("/main")

//!Contacts Challenges Data
router.route("/createChallengesContacts").post(createChallengesContacts);
router.route("/getChallengesContacts/:id").get(getChallengesContacts);
router.route("/updateChallengesContacts/:id").patch(updateChallengesContacts);
router.route("/deleteChallengesContacts/:id").delete(deleteChallengesContacts);

//!Contacts Tasks Data
router.route("/createTasksContacts").post(createTasksContacts);
router.route("/getTasksContacts/:id").get(getTasksContacts);
router.route("/updateTasksContacts/:id").patch(updateTasksContacts);
router.route("/deleteTaskContacts/:id").delete(deleteTaskContacts);

//!Email Signatures
router.route("/getEmailSignature").get(getEmailSignature);
router.route("/getEmailSignature/:id").patch(updateEmailSignature);

//!Gmail API routes
router.route("/gmailAPIPermission").get(gmailAPIPermission);
router.route("/gmailAPIToken").post(gmailAPIToken);
router.route("/gmailAPIEmailSend").post(gmailAPIEmailSend);
router.route("/gmailAPIEmailRead").get(gmailAPIEmailRead);
router.route("/gmailAPICalender").get(gmailAPICalender);
router.route("/gmailAPICreateEventCalender").post(gmailAPICreateEventCalender);
router.route("/gmailAPIUpdateEventCalender").post(gmailAPIUpdateEventCalender);

//!Outlook API routes
router.route("/getAuthUrl").get(getAuthUrl);

// //!Zoom API Routes
// router.route("/createZoomUser").post(createZoomUser);

//!TODAY TO DO ROUTES

//!Apointments
router.route("/getAllApointment").get(getAllApointment);
router.route("/postSingleApointment").post(postSingleApointment);

//!No Appointment

router.route("/getAllNoAppointment").get(getAllNoAppointment);

export default router;
