import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  secure: true, // TLS false for 587
  auth: {
    user: "apikey",               // literally "apikey"
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Work Manager" <fayizpachu217@gmail.com>`, // must be verified in SendGrid
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

export default sendEmail;
