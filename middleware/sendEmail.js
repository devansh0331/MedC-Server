import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    port: process.env.SMTP_PORT,

    host: process.env.SMTP_HOST,
    secure: true,

    logger: true,
    debug: true,

    auth: {
      user: process.env.SMTP_MAIL,

      pass: process.env.SMTP_APP_PASS,
    },
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
