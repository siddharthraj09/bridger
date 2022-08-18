// import  require  from 'module';

import  { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } from 'simple-oauth2'
var clientId = '583e3a76-1208-43cc-a567-3f4d4d5129eb';
var clientSecret = '8b959a82-9e2b-4ede-b769-9bb7ae11bb22';
var redirectUri = 'http://localhost:3000/api/v1/dashboard/outlookAPIToken';

var scopes = [
  'openid',
  'profile',
  'offline_access',
  'https://outlook.office.com/calendars.readwrite'
];

var credentials = {
  clientID: clientId,
  clientSecret: clientSecret,
  site: 'https://login.microsoftonline.com/common',
  authorizationPath: '/oauth2/v2.0/authorize',
  tokenPath: '/oauth2/v2.0/token'
}
// new oauth2(credentials)
// var oauth2 = simple_oauth2.create(credentials)
// console.log(new oauth2.ClientCredentials(credentials))
// var oauth2 = require('simple-oauth2')(credentials)
// const OAuth2Server = require('oauth2-server');
// let oauth = new OAuth2Server({model: model});
// import oauth2 from "simple-oauth2"
// oauth2.create(credentials)
  const getAuthUrl =async function(req,res) {
    var returnVal = oauth2.AuthorizationCode.authorizeURL({
      redirect_uri: redirectUri,
      scope: scopes.join(' ')
    });
    console.log('');
    console.log('Generated auth url: ' + returnVal);
    res.status(200).send(returnVal)
  }

 const  getTokenFromCode = async function(auth_code, callback, request, response) {
    oauth2.authCode.getToken({
      code: auth_code,
      redirect_uri: redirectUri,
      scope: scopes.join(' ')
      }, function (error, result) {
        if (error) {
          console.log('Access token error: ', error.message);
          callback(request ,response, error, null);
        }
        else {
          var token = oauth2.accessToken.create(result);
          console.log('');
          console.log('Token created: ', token.token);
          callback(request, response, null, token);
        }
      });
  }

  const getEmailFromIdToken =async function(id_token) {
    // JWT is in three parts, separated by a '.'
    var token_parts = id_token.split('.');

    // Token content is in the second part, in urlsafe base64
    var encoded_token = new Buffer(token_parts[1].replace('-', '+').replace('_', '/'), 'base64');

    var decoded_token = encoded_token.toString();

    var jwt = JSON.parse(decoded_token);

    // Email is in the preferred_username field
    return jwt.preferred_username
  }

  const  getTokenFromRefreshToken =async function(refresh_token, callback, request, response) {
    var token = oauth2.accessToken.create({ refresh_token: refresh_token, expires_in: 0});
    token.refresh(function(error, result) {
      if (error) {
        console.log('Refresh token error: ', error.message);
        callback(request, response, error, null);
      }
      else {
        console.log('New token: ', result.token);
        callback(request, response, null, result);
      }
    });
  }

  // Home page
// app.get('/', function(req, res) {
//   res.send(pages.loginPage(authHelper.getAuthUrl()));
// });

// app.get('/authorize', function(req, res) {
//   var authCode = req.query.code;
//   if (authCode) {
//     console.log('');
//     console.log('Retrieved auth code in /authorize: ' + authCode);
//     authHelper.getTokenFromCode(authCode, tokenReceived, req, res);
//   }
//   else {
//     // redirect to home
//     console.log('/authorize called without a code parameter, redirecting to login');
//     res.redirect('/');
//   }
// });

// function tokenReceived(req, res, error, token) {
//   if (error) {
//     console.log('ERROR getting token:'  + error);
//     res.send('ERROR getting token: ' + error);
//   }
//   else {
//     // save tokens in session
//     req.session.access_token = token.token.access_token;
//     req.session.refresh_token = token.token.refresh_token;
//     req.session.email = authHelper.getEmailFromIdToken(token.token.id_token);
//     res.redirect('/logincomplete');
//   }
// }

// app.get('/logincomplete', function(req, res) {
//   var access_token = req.session.access_token;
//   var refresh_token = req.session.access_token;
//   var email = req.session.email;
  
//   if (access_token === undefined || refresh_token === undefined) {
//     console.log('/logincomplete called while not logged in');
//     res.redirect('/');
//     return;
//   }
  
//   res.send(pages.loginCompletePage(email));
// });

// app.get('/refreshtokens', function(req, res) {
//   var refresh_token = req.session.refresh_token;
//   if (refresh_token === undefined) {
//     console.log('no refresh token in session');
//     res.redirect('/');
//   }
//   else {
//     authHelper.getTokenFromRefreshToken(refresh_token, tokenReceived, req, res);
//   }
// });

// app.get('/logout', function(req, res) {
//   req.session.destroy();
//   res.redirect('/');
// });

// app.get('/sync', function(req, res) {
//   var token = req.session.access_token;
//   var email = req.session.email;
//   if (token === undefined || email === undefined) {
//     console.log('/sync called while not logged in');
//     res.redirect('/');
//     return;
//   }
  
//   // Set the endpoint to API v2
//   outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
//   // Set the user's email as the anchor mailbox
//   outlook.base.setAnchorMailbox(req.session.email);
//   // Set the preferred time zone
//   outlook.base.setPreferredTimeZone('Eastern Standard Time');
  
//   // Use the syncUrl if available
//   var requestUrl = req.session.syncUrl;
//   if (requestUrl === undefined) {
//     // Calendar sync works on the CalendarView endpoint
//     requestUrl = outlook.base.apiEndpoint() + '/Me/CalendarView';
//   }
  
//   // Set up our sync window from midnight on the current day to
//   // midnight 7 days from now.
//   var startDate = moment().startOf('day');
//   var endDate = moment(startDate).add(7, 'days');
//   // The start and end date are passed as query parameters
//   var params = {
//     startDateTime: startDate.toISOString(),
//     endDateTime: endDate.toISOString()
//   };
  
//   // Set the required headers for sync
//   var headers = {
//     Prefer: [ 
//       // Enables sync functionality
//       'odata.track-changes',
//       // Requests only 5 changes per response
//       'odata.maxpagesize=5'
//     ]
//   };
  
//   var apiOptions = {
//     url: requestUrl,
//     token: token,
//     headers: headers,
//     query: params
//   };
  
//   outlook.base.makeApiCall(apiOptions, function(error, response) {
//     if (error) {
//       console.log(JSON.stringify(error));
//       res.send(JSON.stringify(error));
//     }
//     else {
//       if (response.statusCode !== 200) {
//         console.log('API Call returned ' + response.statusCode);
//         res.send('API Call returned ' + response.statusCode);
//       }
//       else {
//         var nextLink = response.body['@odata.nextLink'];
//         if (nextLink !== undefined) {
//           req.session.syncUrl = nextLink;
//         }
//         var deltaLink = response.body['@odata.deltaLink'];
//         if (deltaLink !== undefined) {
//           req.session.syncUrl = deltaLink;
//         }
//         res.send(pages.syncPage(email, response.body.value));
//       }
//     }
//   });
// });

// app.get('/viewitem', function(req, res) {
//   var itemId = req.query.id;
//   var access_token = req.session.access_token;
//   var email = req.session.email;
  
//   if (itemId === undefined || access_token === undefined) {
//     res.redirect('/');
//     return;
//   }
  
//   var select = {
//     '$select': 'Subject,Attendees,Location,Start,End,IsReminderOn,ReminderMinutesBeforeStart'
//   };
  
//   var getEventParameters = {
//     token: access_token,
//     eventId: itemId,
//     odataParams: select
//   };
  
//   outlook.calendar.getEvent(getEventParameters, function(error, event) {
//     if (error) {
//       console.log(error);
//       res.send(error);
//     }
//     else {
//       res.send(pages.itemDetailPage(email, event));
//     }
//   });
// });

// app.get('/updateitem', function(req, res) {
//   var itemId = req.query.eventId;
//   var access_token = req.session.access_token;
  
//   if (itemId === undefined || access_token === undefined) {
//     res.redirect('/');
//     return;
//   }
  
//   var newSubject = req.query.subject;
//   var newLocation = req.query.location;
  
//   console.log('UPDATED SUBJECT: ', newSubject);
//   console.log('UPDATED LOCATION: ', newLocation);
  
//   var updatePayload = {
//     Subject: newSubject,
//     Location: {
//       DisplayName: newLocation
//     }
//   };
  
//   var updateEventParameters = {
//     token: access_token,
//     eventId: itemId,
//     update: updatePayload
//   };
  
//   outlook.calendar.updateEvent(updateEventParameters, function(error, event) {
//     if (error) {
//       console.log(error);
//       res.send(error);
//     }
//     else {
//       res.redirect('/viewitem?' + querystring.stringify({ id: itemId }));
//     }
//   });
// });

// app.get('/deleteitem', function(req, res) {
//   var itemId = req.query.id;
//   var access_token = req.session.access_token;
  
//   if (itemId === undefined || access_token === undefined) {
//     res.redirect('/');
//     return;
//   }
  
//   var deleteEventParameters = {
//     token: access_token,
//     eventId: itemId
//   };
  
//   outlook.calendar.deleteEvent(deleteEventParameters, function(error, event) {
//     if (error) {
//       console.log(error);
//       res.send(error);
//     }
//     else {
//       res.redirect('/sync');
//     }
//   });
// });





  export {getAuthUrl,
    getTokenFromCode,
    getEmailFromIdToken,
    getTokenFromRefreshToken}

// const getOutlookPermission = async(req, res) => {

// }