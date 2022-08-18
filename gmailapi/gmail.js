import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import { query } from "express";
import console, { Console } from "console";
import express from "express";
import mailparser from "mailparser"
import cheerio from "cheerio";
const app = express();
// import XMLHttpRequest from "xmlhttprequest";
// var xhr = new XMLHttpRequest();

// If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var SCOPES = [
  "https://mail.google.com/",
  'https://www.googleapis.com/auth/gmail.addons.current.message.action',
  'https://www.googleapis.com/auth/gmail.addons.current.message.metadata',
  'https://www.googleapis.com/auth/gmail.addons.current.message.readonly',
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.send",
  //'https://www.googleapis.com/auth/gmail.metadata',
  "https://www.googleapis.com/auth/calendar.readonly",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

const gmailAPI = async (req, res) => {
  // Load client secrets from a local file.
  fs.readFile("client_secret.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Gmail API.
    var finalAns=authorize(JSON.parse(content), listLabels);
    return finalAns
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



  function listLabels(auth) {
    const gmail = google.gmail({ version: "v1", auth });
    gmail.users.labels.list(
      {
        userId: "me",
      },
      (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
        const labels = res.data.labels;
        if (labels.length) {
          // console.log("Labels:");
          // labels.forEach((label) => {
          //   console.log(`- ${label.name} : ${label.id}`);
          // });
        } else {
          console.log("No labels found.");
        }
        //console.log(res.data.messages);
      }
    );

    // fs.readFile("client_secret.json", (err, content) => {
    //   if (err) return console.log("Error loading client secret file:", err);
    //   // Authorize a client with credentials, then call the Gmail API.
    //   authorize(JSON.parse(content), listMessages);
    // });

    // function listMessages(auth) {
    //   console.log("messages");
    //   const query = "label:inbox subject:reminder";
    //   // const query = "uday210622@gmail.com";
    //   return new Promise((resolve, reject) => {
    //     const gmail = google.gmail({ version: "v1", auth });
    //     gmail.users.messages.list(
    //       {
    //         userId: "me",
    //         q: query,
    //       },
    //       (err, res) => {
    //         if (err) {
    //           reject(err);
    //           return;
    //         }
    //         if (!res.data.messages) {
    //           resolve([]);
    //           return;
    //         }
    //         resolve(res.data.messages);
    //       }
    //     );
    //   });
    // }
    // // listMessages(auth, 'label:inbox subject:reminder').then((value) => {
    // //   console.log(value)
    // // })

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
            // resolve(res.data);
            console.log(res.data, "In messages");
         //   console.log(res.data.messages[0].id, "In messages");
           var result = getMail(res.data.messages[0].id, auth);
           console.log(result);
           
           resolve(messagelist.push(result));
           // getMail(res.data.messages[0].id, auth);
          }
        );
      });
    }

    function getMail(msgId, auth) {
      console.log(msgId);
      let singlemessage;
            const gmail = google.gmail({ version: "v1", auth });
      //This api call will fetch the mailbody.
      gmail.users.messages.get(
        {
          userId: "me",
          id: msgId,
        },
        (err, res) => {
          console.log(res.data.labelIds.INBOX);
          if (!err) {
            console.log("no error");
            singlemessage=res.data.payload;
            console.log(res.data.payload);
            console.log('AFTER USER MESSGAES CALLED')
/*
            // var body = res.data.payload.body.data;
            // const encodedMessage =  res.data.payload["parts"][0].body.data;

            // const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");
            // console.log("decodedStr",decodedStr)
        
            // var body = res.data.payload.body.data;
            console.log("body", body);
            // var htmlBody = base64.decode(body.replace(/-/g, '+').replace(/_/g, '/'));
            var htmlBody = new Buffer(body)
              .toString("base64")
              .replace(/\+/g, "-")
              .replace(/\//g, "_");
            console.log(htmlBody);
            // var mailparser =  mailparser
            var mailparse = new mailparser.MailParser()

            mailparse.on("end", (err, res) => {
              console.log("res", res);
            });

            mailparse.on("data", (dat) => {
              if (dat.type === "text") {
                console.log(dat)
                console.log(dat.textAsHtml)
                const $ = cheerio.load(dat.textAsHtml);
                var links = [];
                var modLinks = [];
                $("a").each(function (i) {
                  links[i] = $(this).attr("href");
                });

                //Regular Expression to filter out an array of urls.
                var pat = /------[0-9]-[0-9][0-9]/;

                //A new array modLinks is created which stores the urls.
                modLinks = links.filter((li) => {
                  if (li.match(pat) !== null) {
                    return true;
                  } else {
                    return false;
                  }
                });
                console.log(modLinks);

                //This function is called to open all links in the array.
              }
            });

            mailparse.write(htmlBody);
            mailparse.end(); */
          }
        }
      );
      return singlemessage;
    }

    fs.readFile("client_secret.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Gmail API.
       var allData =   authorize(JSON.parse(content), listMessages);
       console.log('listmessages funcion',allData);
       return allData
 
    });
    console.log("------------After Messages----------------");
    // console.log(messages)
    function makeBody(to, from, subject, message) {
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

      var encodedMail = new Buffer(str)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
      return encodedMail;
    }

    function sendMessage(auth) {
      var raw = makeBody(
        "siddharth@elitemindz.co",
        "uday210622@gmail.com",
        "This is your subject",
        "I got this working finally!!!"
      );
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
    }

    fs.readFile(
      "client_secret.json",
      function processClientSecrets(err, content) {
        if (err) {
          console.log("Error loading client secret file: " + err);
          return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Gmail API.
        authorize(JSON.parse(content), sendMessage);
      }
    );

    function listEvents(auth) {
      const calendar = google.calendar({ version: "v3", auth });
      calendar.events.list(
        {
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: "startTime",
        },
        (err, res) => {
          if (err) return console.log("The API returned an error: " + err);
          const events = res.data.items;
          if (events.length) {
            console.log("Upcoming 10 events:");
            // console.log("List of upcoming events: ", res.data);
            console.log("----------------------------------------------");
            // console.log("List of upcoming events: ", res.data.items);
            events.map((event, i) => {
              const start = event.start.dateTime || event.start.date;
              console.log(`${start} - ${event.summary}`);
            });
          } else {
            console.log("No upcoming events found.");
          }
        }
      );
    }
    // fs.readFile("client_secret.json", (err, content) => {
    //   if (err) return console.log("Error loading client secret file:", err);
    //   // Authorize a client with credentials, then call the Google Calendar API.
    //   authorize(JSON.parse(content), listEvents);
    // });
  }
};
// app.get('/',(req,res)=>{
//   const codeOb=req.query.code
//   res.json({code:codeOb})

// })
// app.listen('6000',()=>{
//     console.log("server is listening on port 3000")
// })
// gmailAPI();

export default gmailAPI
