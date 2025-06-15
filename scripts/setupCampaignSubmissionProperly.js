import fetch from 'node-fetch';
import 'dotenv/config';

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;

async function createObjectWithDisplayProperty() {
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
      primaryDisplayProperty: 'campaign_name',
      requiredProperties: ['campaign_name'],
      associatedObjects: ['CONTACT'],
      metaType: 'PORTAL_SPECIFIC',
      properties: [
        {
          name: 'campaign_name',
          label: 'Campaign Name',
          type: 'string',
          fieldType: 'text',
          groupName: 'campaign_submission_information'
        }
      ]
    }),
  });

  const result = await response.json();
  console.log('✅ Custom object (with display property) created:', result);
}

createObjectWithDisplayProperty();
