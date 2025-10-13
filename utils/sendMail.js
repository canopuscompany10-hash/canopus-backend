import nodemailer from "nodemailer";

// Create transporter with SendGrid
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Manager" <canopuscompany10@gmail.com>`, // valid email
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
