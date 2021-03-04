const nodemailer = require("nodemailer");
async function sendMail({ from, to, subject, text, html }) {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email", //process.env.SMTP_HOST,
    port: 587, // process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: testAccount.user, // process.env.MAIL_USER,
      pass: testAccount.pass, //process.env.MAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });
  console.log(info);
}

module.exports = sendMail;
