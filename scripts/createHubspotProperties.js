// scripts/createHubspotProperties.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
const OBJECT_TYPE_ID = '2-46138773'; // ✅ Correct object type ID

const properties = [
  { name: 'campaign_name', label: 'Campaign Name', type: 'string', fieldType: 'text' },
  { name: 'brand_name', label: 'Brand Name', type: 'string', fieldType: 'text' },
  { name: 'firebase_id', label: 'Firebase ID', type: 'string', fieldType: 'text' },
  { name: 'promotion_type', label: 'Promotion Type', type: 'string', fieldType: 'text' },
  { name: 'creative_hook', label: 'Creative Hook', type: 'string', fieldType: 'text' },
  { name: 'category', label: 'Category', type: 'string', fieldType: 'text' },
  { name: 'submitted_at', label: 'Submitted At', type: 'datetime', fieldType: 'date' },
];

async function createProperties() {
  for (const prop of properties) {
    const response = await fetch(
      `https://api.hubapi.com/crm/v3/properties/${OBJECT_TYPE_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: prop.name,
          label: prop.label,
          type: prop.type,
          fieldType: prop.fieldType,
          groupName: 'campaign_submission_information',
        }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ Created property: ${prop.label}`);
    } else if (
      result?.message?.includes('already exists') ||
      result?.category === 'CONFLICT'
    ) {
      console.log(`⚠️ Already exists or skipped: ${prop.label}`);
    } else {
      console.error(`❌ Failed to create: ${prop.label}`, result);
    }
  }
}

createProperties().catch((err) => {
  console.error('🚨 Script failed:', err.message);
});
