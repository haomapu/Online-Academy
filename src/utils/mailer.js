import nodeMailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import dotenv from "dotenv";


dotenv.config();
const adminEmail = process.env.adminEmail;
const adminPassword = process.env.adminPassword;
const mailHost = 'smtp.gmail.com'
const mailPort = 587

const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
const otptxt = otp.toUpperCase()
const txt = `Your verify code: ${otptxt}`

const sendMail = (receiver) => {
  console.log(adminEmail);
  console.log(adminPassword);
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: mailHost,
    port: mailPort,
    secure: false, 
    auth: {
      user: adminEmail,
      pass: adminPassword,
    }
  })
  const options = {
    from: adminEmail, 
    to: receiver,
    subject: "Verify your email",
    text: txt
  }
  return transporter.sendMail(options)
};

export default {otp,sendMail};

