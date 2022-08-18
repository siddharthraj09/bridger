// import  totp from 'totp-generator'

// const token = totp("JBSWY3DPEHPK3PXP", {
// 	digits: 4,
// 	algorithm: "SHA-512",
// 	period: 60,
// 	timestamp: 1465324707000,
// });
// console.log(token); 

const OtpGen = async (req, res) => {
    let otpcode = Math.floor(1000 + Math.random() * 9000);
    return otpcode;
  };
  export default OtpGen