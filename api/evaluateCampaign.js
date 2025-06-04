// /api/evaluateCampaign.js

import { OpenAI } from 'openai';
import { buildEvaluatorPrompt } from '../lib/prompts.js';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { db } from '../src/firebase-server.js';
import { sendEvaluationEmail } from '../lib/sendEvaluationEmail.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

if (!getApps().length) {
  initializeApp(firebaseConfig);
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    console.log('📦 Received data for evaluation:', JSON.stringify(data, null, 2));

    const prompt = buildEvaluatorPrompt(data, data.country || 'Not specified');

    const chat = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.75,
    });

    const html = chat.choices?.[0]?.message?.content;

    if (!html || typeof html !== 'string' || html.trim() === '') {
      console.error('❌ GPT returned no usable content.');
      return res.status(500).json({ error: 'GPT returned no usable content.' });
    }

    // ✅ Send the evaluation email
    await sendEvaluationEmail({
      to: data.email,
      subject: `Your Trudy Campaign Evaluation for ${data.brandName}`,
      html,
    });

    // ✅ Save to Firestore
    await addDoc(collection(db, 'evaluations'), {
      ...data,
      html,
      createdAt: serverTimestamp(),
    });

    res.status(200).json({ html });
  } catch (err) {
    console.error('❌ Evaluation API error:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'GPT API call failed', detail: err.message });
  }
}
