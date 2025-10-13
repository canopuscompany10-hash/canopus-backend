import nodemailer from "nodemailer";

import dotenv from "dotenv";




dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // TLS
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Work Manager" <${process.env.EMAIL_USER}>`,
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
