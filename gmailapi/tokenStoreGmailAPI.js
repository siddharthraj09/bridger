import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import express from "express";
const TOKEN_PATH = "./token.json";
const sendGmailAPI = async (req, res) => {
  // function authorize(credentials) {

    fs.readFile("./client_secret.json", (err, credentials) => {
        if (err) return console.log("Error loading client secret file:", err);
        const { client_secret, client_id, redirect_uris } = JSON.parse(credentials).installed;
        // var client_secret = credentials.client_secret; var client_id = credentials.client_id; var redirect_uris = credentials.redirect_uris;
        const oAuth2Client = new google.auth.OAuth2(
          client_id,
          client_secret,
          redirect_uris[0]
        );
      
    
 
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return ('Please grant permission');
    oAuth2Client.setCredentials(JSON.parse(token));
    //   callback(oAuth2Client);
  });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    // res.status(200).json({url:codeDet})
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);

      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      //  callback(oAuth2Client);
    });
  });
});
    res.status(201).json('token stored Successfully')
};

export default sendGmailAPI;
