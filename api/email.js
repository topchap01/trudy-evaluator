// /api/email.js
import { sendEvaluationEmail } from "../firebase/functions/lib/sendEvaluationEmail.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { to, subject, html } = req.body;

  try {
    const result = await sendEvaluationEmail({ to, subject, html });
    if (result.success) {
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      res.status(500).json({ message: "Email failed", error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
