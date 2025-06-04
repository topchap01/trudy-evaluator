// api/sendEvaluateEmail.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { to, subject, html } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Trudy Evaluator" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    res.status(500).json({ error: error.message });
  }
}
