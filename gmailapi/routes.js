import express from 'express'
const router = express.Router();
import gmailAPIPermission from './gmailApiPermission.js'
import tokenStoreGmailAPI from './tokenStoreGmailAPI.js'
import sendEmailViaGmail from './onlySendEmailAPI.js'

router.get('/gmailAPI',gmailAPIPermission)
router.post('/token',tokenStoreGmailAPI)
router.get('/emailSendAPI',sendEmailViaGmail)

export default router;