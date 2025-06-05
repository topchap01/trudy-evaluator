import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function sendEvaluationEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // 👇 Read the generated PDF file from the temp directory
  const pdfPath = path.resolve(`/tmp/${userId || timestamp}_evaluation.pdf`);

  const pdfContent = fs.readFileSync(pdfPath).toString('base64');

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
    attachments: [
      {
        filename: 'Trudy_Evaluation_Report.pdf',
        content: pdfContent,
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ]
  });
}
