import nodemailer from 'nodemailer';

export async function sendEvaluationEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true', // optional: toggle TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    });

    console.log(`✅ Email sent to ${to} | Message ID: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Email send failed to ${to}:`, err.message);
    throw err;
  }
}

