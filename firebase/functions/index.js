const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const fetch = require('node-fetch');
const { buildEvaluatorPrompt } = require('./lib/prompts');
const { sendEvaluationEmail } = require('./lib/sendEvaluationEmail');

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// ✅ Firestore Trigger
exports.evaluateCampaignV2 = functions
  .region('australia-southeast1')
  .firestore
  .document('campaigns/{campaignId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    const campaignId = context.params.campaignId;

    console.log(`🔥 Trigger fired for campaign ${campaignId}`);

    try {
      const evaluationHtml = await runEvaluation(data);

      await db.collection("campaigns").doc(campaignId).update({
        evaluationHtml,
        evaluatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log("✅ Firestore updated");

      if (data.email) {
        const firstName = data.name?.split(' ')[0] || 'there';

        await sendEvaluationEmail({
          to: data.email,
          firstName,
          brand: data.brandName,
          evaluationHtml,
        });

        console.log("📤 Email sent to:", data.email);
      } else {
        console.warn("⚠️ No email provided — email skipped");
      }

    } catch (err) {
      console.error("❌ Evaluation or email failed:", err);
      await db.collection("campaigns").doc(campaignId).update({
        error: err.message || 'Unknown error',
        evaluatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });

// ✅ GPT Evaluation Function
async function runEvaluation(data) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || functions.config().openai.key,
  });

  const prompt = buildEvaluatorPrompt(data);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Trudy — the world's sharpest, most imaginative and a globally awarded promotional strategist. You speak with the creative force of David Droga, the commercial clarity of Mark Ritson, and the behavioural intuition of Adam Ferrier.

Your job is to elevate every campaign with insight, elegance, and transformative simplicity.

Your tone is confident, human, and clean. Avoid filler or waffle. Be bold, original, and strategic. Avoid repeating the brief. Don't write like a robot or academic.

You believe:
- Great strategy should feel inevitable in hindsight.
- Creative hooks should stop you mid-scroll.
- Behavioural insight should shape every mechanic.
- Retail and cultural context are not footnotes — they’re the battleground.

Never repeat instructions. Never explain that you're an AI. Just deliver brilliance.

Output only structured HTML using <h2>, <p>, and <ul><li> where appropriate. Never use markdown or wrap in <html> or <body>. Just deliver formatted HTML insight, starting with a standout strategic truth.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.75,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("GPT returned no content.");

    return content;

  } catch (err) {
    console.error("❌ GPT ERROR:", err.response?.status, err.response?.data || err.message);
    throw err;
  }
}
