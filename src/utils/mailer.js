import nodeMailer from 'nodemailer';
import otpGenerator from 'otp-generator';
const adminEmail = 'onlineacademyktpm@gmail.com'
const adminPassword = 'kderjhutasgcbjgz'
const mailHost = 'smtp.gmail.com'
const mailPort = 587

const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
const otptxt = otp.toUpperCase()
const txt = `Your verify code: ${otptxt}`

const sendMail = (receiver) => {

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

