// lib/sendEvaluationEmail.js
import nodemailer from "nodemailer";

export async function sendEvaluationEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,     // e.g. "smtp.sendgrid.net" or "smtp.gmail.com"
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,   // your email username
      pass: process.env.SMTP_PASS    // your email password or app password
    }
  });

  const mailOptions = {
    from: `"Trudy Evaluator" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📤 Email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Email failed:", error);
    return { success: false, error };
  }
}
