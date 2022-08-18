import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import { query } from "express";
import console, { Console } from "console";
import express from "express";
import mailparser from "mailparser";
import cheerio from "cheerio";
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

const gmailAPIPermission = async (req, response) => {
  // Load client secrets from a local file.
  fs.readFile("./client_secret.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Gmail API.
    var finalAns = authorize(JSON.parse(content), listMessages)
      console.log('From where gmailAPI called', finalAns)
    return finalAns;
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    // var client_secret = credentials.client_secret; var client_id = credentials.client_id; var redirect_uris = credentials.redirect_uris;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token", err);
        oAuth2Client.setCredentials(token);

        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  /**
   * Lists the labels in the user's account.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */

  //!List messages
   function listMessages(auth, query) {
    query = "uday210622@gmail.com";
    var messagelist = [];
    return new Promise((resolve, reject) => {
      const gmail = google.gmail({ version: "v1", auth });
      // gmail.users.messages.list(
      gmail.users.messages.list(
        {
          userId: "me",
          q: query,
          maxResults: 10,
        },
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          if (!res.data.messages) {
            resolve([]);
            return;
          }
          resolve(res.data);
            // console.log(res.data, "In messages");
           // console.log(res.data.messages[0].id, "In messages");
       var result =   getMail(res.data.messages[0].id, auth).then((data)=>{
        console.log(data,'data coming in list messages')
        return data
        
      })

      result.then((data) =>{
        console.log(data,"coming result .then varialbe")
      } )

     // console.log(result,'ans coming from only result')
          // console.log(result);
          //    var newResult = messagelist.push(result)
          //console.log(result);
          //  console.log('after list messages called',newResult)
          resolve(result);
          // getMail(res.data.messages[0].id, auth);
        }
      );
    });

    async function getMail(msgId, auth) {
      // console.log(msgId);
      //  let singlemessage;
      return new Promise((resolve, reject) => {

        if(msgId){
      const gmail = google.gmail({ version: "v1", auth });
      //This api call will fetch the mailbody.
      gmail.users.messages.get(
        {
          userId: "me",
          id: msgId,
        },
        (err, res) => {
          //  console.log(res.data.labelIds.INBOX);
          if (!err) {
            //  console.log("no error");
            var singlemessage = res.data.payload;
         //   console.log(res.data.payload.headers);

            console.log("AFTER USER MESSGAES CALLED");
            // return singlemessage;

          //  var body = res.data.payload;
         // var body = res.data.payload.parts[0].body.data;
          //  console.log(body)
            // const encodedMessage =  res.data.payload["parts"][0].body.data;

            // const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");
            // console.log("decodedStr",decodedStr)

            //var body = res.data.payload.body.data;
           //  console.log("body", body);
            // var htmlBody = base64.decode(body.replace(/-/g, '+').replace(/_/g, '/'));

            //  var htmlBody = atob(body.replace(/_/g, "/").replace(/-/g, "+"));
            // console.log(htmlBody);
            resolve(singlemessage) ;
            // console.log(singlemessage);

            // var htmlBody = new Buffer(body)
            //   .toString("base64")
            //   .replace(/\+/g, "-")
            //   .replace(/\//g, "_");
            // console.log(htmlBody);
            // var mailparser =  mailparser
            // var mailparse = new mailparser.MailParser()

            // mailparse.on("end", (err, res) => {
            //   console.log("res", res);
            // });

            // mailparse.on("data", (dat) => {
            //   if (dat.type === "text") {
            //     console.log(dat)
            //     console.log(dat.textAsHtml)
            //     const $ = cheerio.load(dat.textAsHtml);
            //     var links = [];
            //     var modLinks = [];
            //     $("a").each(function (i) {
            //       links[i] = $(this).attr("href");
            //     });

            //     //Regular Expression to filter out an array of urls.
            //     var pat = /------[0-9]-[0-9][0-9]/;

            //     //A new array modLinks is created which stores the urls.
            //     modLinks = links.filter((li) => {
            //       if (li.match(pat) !== null) {
            //         return true;
            //       } else {
            //         return false;
            //       }
            //     });
            //     console.log(modLinks);

            //This function is called to open all links in the array.
            //   }
            // });

            // mailparse.write(htmlBody);
            // mailparse.end();
          }
        }
      );
        }
        else{
          reject(console.log('No Msg ID present '))
        }
    })
  
  }

};
}

export default gmailAPI;
