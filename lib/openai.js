// lib/openai.js
export async function callGPT(data) {
  const response = await fetch('/api/evaluateCampaign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error('GPT API error:', err);
    throw new Error('GPT API call failed');
  }

  const result = await response.json();
  return result.html;
}

