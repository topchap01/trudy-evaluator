import fetch from 'node-fetch';
import 'dotenv/config';

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;

// Phase 1: Create object without primaryDisplayProperty
async function createCustomObject() {
  const response = await fetch('https://api.hubapi.com/crm/v3/schemas', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'campaign_submission',
      labels: {
        singular: 'Campaign Submission',
        plural: 'Campaign Submissions'
      },
      associatedObjects: ['CONTACT'],
      metaType: 'PORTAL_SPECIFIC'
    }),
  });

  const result = await response.json();
  console.log('✅ Object Created:', result);
}

// Phase 2: Create properties
const properties = [
  { name: 'campaign_name', label: 'Campaign Name' },
  { name: 'brand_name', label: 'Brand Name' },
  { name: 'firebase_id', label: 'Firebase ID' },
  { name: 'promotion_type', label: 'Promotion Type' },
  { name: 'creative_hook', label: 'Creative Hook' },
  { name: 'category', label: 'Category' },
  { name: 'submitted_at', label: 'Submitted At', type: 'datetime', fieldType: 'date' },
];

async function createProperties() {
  for (const prop of properties) {
    const response = await fetch('https://api.hubapi.com/crm/v3/properties/campaign_submission', {
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

// Phase 3: Set campaign_name as the primary display property
async function setPrimaryDisplay() {
  const response = await fetch('https://api.hubapi.com/crm/v3/schemas/campaign_submission', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      primaryDisplayProperty: 'campaign_name'
    }),
  });

  const result = await response.json();
  console.log('✅ Primary display property updated:', result);
}

// Run all steps in sequence
(async () => {
  await createCustomObject();
  console.log('🔁 Waiting 5 seconds before property creation...');
  await new Promise(resolve => setTimeout(resolve, 5000)); // Give HubSpot a moment to register the object
  await createProperties();
  await setPrimaryDisplay();
})();
