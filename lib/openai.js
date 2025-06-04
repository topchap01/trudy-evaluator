// lib/openai.js
export async function callGPT({ mode, data }) {
  const endpoint = mode === 'clarifier'
    ? '/api/clarifier'     // <--- now points to your new clarifier API
    : '/api/evaluateCampaign';

  const response = await fetch(endpoint, {
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
  return mode === 'clarifier' ? result.questions : result.html;
}

