const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
const sendMail = async (userData) => {
  try {
    let mailOption = {
      from: process.env.SMTP_MAIL,
      to: userData.email,
      subject: " Your code",
      html: `<h1>Your Otp is:<b> ${userData.Otp}</b></h1>`,
    };
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
        return false;
      } else {
        console.log(" mail sent", info.response);
        return true;
      }
    });
  } catch (error) {
    res.json({ message: "error", error });
    return false;
  }
};

module.exports = {
  sendMail,
};
