import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import { query } from "express";
import console, { Console } from "console";
import express from "express";
import mailparser from "mailparser";
import cheerio from "cheerio";
import "express-async-errors";
// import XMLHttpRequest from "xmlhttprequest";
// var xhr = new XMLHttpRequest();
const app = express();
// If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.addons.current.message.action",
  "https://www.googleapis.com/auth/gmail.addons.current.message.metadata",
  "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.send",
  //'https://www.googleapis.com/auth/gmail.metadata',
  "https://www.googleapis.com/auth/calendar.readonly",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "./token.json";

const gmailAPIPermission = async (req, res ,next) => {
  // Load client secrets from a local file.
  fs.readFile("./client_secret.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Gmail API.
     authorize(JSON.parse(content))
    //  console.log('From where gmailAPI called', finalAns)
   // return finalAns;
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    // var client_secret = credentials.client_secret; var client_id = credentials.client_id; var redirect_uris = credentials.redirect_uris;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client);
      oAuth2Client.setCredentials(JSON.parse(token));
    //   callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  //  let codeDet = req.query
   res.status(200).json({url:authUrl})
  //  next()
    // rl.question("Enter the code from that page here: ", (code) => {
    //  // res.status(200).json({url:codeDet})
    //   rl.close();
    //   oAuth2Client.getToken(code, (err, token) => {
    //     if (err) return console.error("Error retrieving access token", err);
    //     oAuth2Client.setCredentials(token);

    //     // Store the token to disk for later program executions
    //     fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    //       if (err) return console.error(err);
    //       console.log("Token stored to", TOKEN_PATH);
    //     });
    //   //  callback(oAuth2Client);
    //   });
    // });
  }
 // res.status(200).json('Token Generated Successfully')
  /**
   * Lists the labels in the user's account.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
*/}
export default gmailAPIPermission;