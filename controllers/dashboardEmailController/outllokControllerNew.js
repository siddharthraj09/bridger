// var clientId = "583e3a76-1208-43cc-a567-3f4d4d5129eb";
var clientId = "f1e1f3bf-c049-447e-aa89-37734670ac86";
var clientSecret = "idP8Q~_Z9XrGVTE1sK7PlS9vWOgNDtoZoUGHfcd.";
var redirectUri = "http://localhost:3000/api/v1/auth";
// Sz28Q~Sdpi2TH8iWjD7gtsSCn2mDECkx1dY8HaY8
var scopes = [
  "openid",
  "profile",
  "offline_access",
  "https://outlook.office.com/calendars.readwrite",
];

const config = {
  client: {
    id: clientId,
    secret: clientSecret,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
    // tokenHost: "https://api.oauth.com",
  },
};

import  {
  ClientCredentials,
  ResourceOwnerPassword,
  AuthorizationCode,
}from "simple-oauth2"

async function getAuthUrl(req,res) {  
  const client = new AuthorizationCode(config);

  const authorizationUri = client.authorizeURL({
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    // state: "<state>",
  });

  // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
  console.log(authorizationUri)

//   const tokenParams = {
//     code: "<code>",
//     redirect_uri: "http://localhost:3000/callback",
//     scope: scopes,
//   };

//   try {
//     const accessToken = await client.getToken(tokenParams);
//     console.log(accessToken)
//   } catch (error) {
//     console.log("Access Token Error", error.message);
//   }
}

export {getAuthUrl}
