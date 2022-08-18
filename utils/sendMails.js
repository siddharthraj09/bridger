import nodemailer from "nodemailer";

async function mailer(email, otp) {
  var email = email;
  var token = otp;
    console.log('step 1')
    // smtp-mail.outlook.com
  var mail = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com", 
    port: 587,
    secureConnection: false, // use SSL
    auth: {
      user: "bridger210622@gmail.com", // Your email id
      pass: "cuhhzawfnpqizxcf", // Your password
    },
    connectionTimeout: 5 * 60 * 1000,
    tls:{
        rejectUnauthorized:false , 
    }
  });

  var mailOptions = {
    from: "siddharthelitemindz@gmail.com",
    to: email,
    subject: "Testing",
    Text: "First Email send from nodejs nodemailer",
    html:
      `<p>You requested for reset password, kindly use this token ${token}`,
  };

  mail.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return false
    } else {
      console.log("Email sent successfully")
      return true;
    }
  });
  return true
}

export default mailer;
