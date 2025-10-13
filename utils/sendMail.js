import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_USER, // verified sender
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
};

export default sendEmail;
