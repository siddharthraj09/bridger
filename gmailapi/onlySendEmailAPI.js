import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import express from "express";

const TOKEN_PATH = "./token.json";


const sendEmailViaGmail = async (req, res) => {

  const {to,from,subject,message}= req.body

  // const to = "siddharth@elitemindz.co";
  // const from = "uday210622@gmail.com";
  // const subject = "This is your subject from API";
  // const message = "I got this working finally!!!";
  fs.readFile(
    "./client_secret.json",
    function processClientSecrets(err, credentials) {
      if (err) {
        console.log("Error loading client secret file: " + err);
        return;
      }

      const { client_secret, client_id, redirect_uris } =
        JSON.parse(credentials).installed;
      // var client_secret = credentials.client_secret; var client_id = credentials.client_id; var redirect_uris = credentials.redirect_uris;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );
      fs.readFile(TOKEN_PATH,async (err, token) => {
        if (err) return ('please generate token');
        oAuth2Client.setCredentials(JSON.parse(token));
        await sendMessage(oAuth2Client, to, from, subject, message);
        // callback(oAuth2Client);
      });

      // Authorize a client with the loaded credentials, then call the
      // Gmail API.
    //   sendMessage(oAuth2Client, to, from, subject, message);
    }
  );

    async  function makeBody(to, from, subject, message) {
    var str = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      "to: ",
      to,
      "\n",
      "from: ",
      from,
      "\n",
      "subject: ",
      subject,
      "\n\n",
      message,
    ].join("");
    console.log("in  make body ")
    var encodedMail = new Buffer(str)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    return encodedMail;
  }

  async function sendMessage(auth, to, from, subject, message) {
    console.log('before make body called')
    var raw = await makeBody(to, from, subject, message);
    console.log('after make body called')
    const gmail = google.gmail({ version: "v1", auth });
    gmail.users.messages.send(
      {
        auth: auth,
        userId: "me",
        resource: {
          raw: raw,
        },
      },
      function (err, response) {
        return err || response;
      }
    );
    console.log("email sent succesfully")
    res.status(200).json("Email sent succesfully");
  }
  
};

export default sendEmailViaGmail;
