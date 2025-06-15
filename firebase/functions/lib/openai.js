// lib/openai.js

export async function callGPT(data) {
  try {
    const response = await fetch('/api/evaluateCampaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ GPT API error:', error);
      throw new Error('GPT API call failed');
    }

    const result = await response.json();
    return result.html;
  } catch (err) {
    console.error('❌ Error in callGPT:', err);
    throw err;
  }
}
