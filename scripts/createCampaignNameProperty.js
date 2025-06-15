import fetch from 'node-fetch';
import 'dotenv/config';

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;

async function createInitialProperty() {
  const res = await fetch('https://api.hubapi.com/crm/v3/properties/campaign_submission', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'campaign_name',
      label: 'Campaign Name',
      type: 'string',
      fieldType: 'text',
      groupName: 'campaign_submission_information'
    }),
  });

  const result = await res.json();
  console.log('📌 Created campaign_name property:', result);
}

createInitialProperty();
