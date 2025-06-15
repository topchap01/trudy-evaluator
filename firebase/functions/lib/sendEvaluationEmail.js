import nodemailer from 'nodemailer';
import juice from 'juice';
import functions from 'firebase-functions';

export async function sendEvaluationEmail({ to, firstName, brand, evaluationHtml }) {
  const smtpPass = functions.config().sendgrid.pass;
  const smtpFrom = functions.config().sendgrid.from;

  const rawHtml = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #ffffff;
          color: #111;
          margin: 0;
          padding: 30px;
          line-height: 1.6;
        }
        .container {
          max-width: 720px;
          margin: auto;
          border: 1px solid #eee;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        h1 {
          color: #b30000;
          font-size: 24px;
          margin-bottom: 10px;
        }
        h2 {
          font-size: 18px;
          color: #333;
          margin-top: 40px;
        }
        p {
          font-size: 15px;
          color: #333;
          margin-bottom: 20px;
        }
        .footer {
          font-size: 12px;
          color: #888;
          border-top: 1px solid #eee;
          padding-top: 20px;
          margin-top: 40px;
        }
        .footer a {
          color: #b30000;
          text-decoration: none;
        }
        .cta-button {
          display: inline-block;
          background-color: #b30000;
          color: #fff;
          padding: 12px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Trudy's Evaluation for ${brand}</h1>
        <p>Hi ${firstName},</p>

        <p>Thanks again for sharing your campaign. Below is your personalised Trudy evaluation — designed to sharpen your thinking and spark a few new ideas.</p>

        <p><strong>What is Trevor?</strong> It’s the smarter way to run promotional campaigns. Trevor brings operational rigour. Trudy brings strategic insight. Together, we help brands and agencies launch compliant, creative, results-driven promotions — without extra layers or cost.</p>

        <p>We're not here to replace your agency — we're here to help make your ideas easier to deliver, easier to approve, and more likely to perform.</p>

        <hr style="margin: 40px 0;" />

        ${evaluationHtml}

        <h2>Want to take it further?</h2>
        <p>If you'd like a deeper evaluation — including campaign comparisons, stakeholder-ready summaries, or creative refinement — we’d love to help. Many clients use this next step to build internal confidence and validate creative routes.</p>

        <p>
          <a href="mailto:mark@trevor.services?subject=Request%20for%20deeper%20evaluation" class="cta-button">
            📊 Request a deeper report
          </a>
        </p>

        <p style="margin-top: 20px;">
          Prefer a quick chat? <a href="https://wa.me/61408280000?text=Hi%20Trudy%2C%20I'd%20like%20to%20discuss%20a%20deeper%20evaluation." style="color:#b30000;">Message us on WhatsApp</a>.
        </p>

        <p>— Trudy & the Trevor Team</p>

        <div class="footer">
          Sent by Trudy, part of Trevor Services.<br/>
          © ${new Date().getFullYear()} Trevor Services — <a href="https://trevor.services">trevor.services</a>
        </div>
      </div>
    </body>
  </html>
  `;

  const inlinedHtml = juice(rawHtml); // ✅ Inline all styles for email client compatibility

  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject: `Trudy Evaluation for ${brand}`,
    html: inlinedHtml,
  });
}
