
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv"

dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY, "ithane athe");

export const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: "fayizpachu217@gmail.com", // must be verified
      subject,
      html,
    };
    await sgMail.send(msg);
    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

