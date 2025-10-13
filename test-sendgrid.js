import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: { user: "apikey", pass: process.env.SENDGRID_API_KEY },
});

transporter.sendMail({
  from: '"Work Manager" <fayizpachu217@gmail.com>',
  to: "your-email@gmail.com",
  subject: "SendGrid Test",
  text: "Hello! This is a test from SendGrid SMTP.",
})
.then(() => console.log("Email sent!"))
.catch(err => console.error(err));
