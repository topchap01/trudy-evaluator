import fetch from 'node-fetch';
import 'dotenv/config';

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
const OBJECT_TYPE_ID = '2-46138773'; // Your new custom object ID

const properties = [
  { name: 'brand_name', label: 'Brand Name' },
  { name: 'firebase_id', label: 'Firebase ID' },
  { name: 'promotion_type', label: 'Promotion Type' },
  { name: 'creative_hook', label: 'Creative Hook' },
  { name: 'category', label: 'Category' },
  { name: 'submitted_at', label: 'Submitted At', type: 'datetime', fieldType: 'date' },
];

async function createProperties() {
  for (const prop of properties) {
    const response = await fetch(`https://api.hubapi.com/crm/v3/properties/${OBJECT_TYPE_ID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: prop.name,
        label: prop.label,
        type: prop.type || 'string',
        fieldType: prop.fieldType || 'text',
        groupName: 'campaign_submission_information',
      }),
    });

    const result = await response.json();
    console.log(`✅ Property created: ${prop.label}`, result);
  }
}

createProperties();
