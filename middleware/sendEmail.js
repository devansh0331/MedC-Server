import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // BLOG CODE

    // host: process.env.SMPT_HOST,
    // port: process.env.SMPT_PORT,
    // secure: true, // Use SSL
    // auth: {
    //   user: process.env.SMPT_MAIL,
    //   pass: process.env.SMPT_APP_PASS,
    // },
    // authMethod: "LOGIN",
    // Specify the authentication method

    // MY CODE

    port: process.env.SMTP_PORT,
    // service:'Gmail',
    host: process.env.SMTP_HOST,
    secure: true,
    // secureConnection: false,
    logger: true,
    debug: true,

    auth: {
      //   user: process.env.SMTP_MAIL,
      user: process.env.SMTP_MAIL,
      //   pass: process.env.SMTP_PASSWORD
      pass: process.env.SMTP_APP_PASS,
    },
    // tls:{
    //     rejectUnAuthorized:true
    // }
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.to,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
