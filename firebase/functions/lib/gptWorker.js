import { runEvaluation } from './runEvaluation.js'; // or wherever you've saved it

export const evaluateCampaign = onDocumentCreated('campaigns/{docId}', async (event) => {
  const data = event.data?.data();
  const docId = event.params.docId;
  if (!data) return;

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const evaluationHtml = await runEvaluation(data, apiKey);

    await db.collection('campaigns').doc(docId).update({
      evaluationHtml
    });
  } catch (error) {
    console.error(`❌ Failed to evaluate campaign ${docId}:`, error.message);
  }
});
