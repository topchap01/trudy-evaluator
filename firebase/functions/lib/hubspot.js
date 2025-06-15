// lib/hubspot.js
const fetch = require('node-fetch');

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
const OBJECT_TYPE_ID = '2-46138773'; // Replace with your actual custom object ID

async function createCampaignSubmission({
  name,
  email,
  company,
  brandName,
  creativeHook,
  promotionType,
  category,
  firebaseId,
}) {
  if (!HUBSPOT_TOKEN) {
    throw new Error("Missing HUBSPOT_TOKEN environment variable");
  }

  // ✅ Step 1: Create or update contact
  let contactId;
  const contactResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        email,
        firstname: name,
        company,
      },
    }),
  });

  const contactResult = await contactResponse.json();

  if (!contactResponse.ok) {
    // Try to extract existing contact ID if contact already exists
    if (contactResult.status === 'error' && contactResult.message?.includes('Contact already exists')) {
      contactId = contactResult.message.match(/Existing ID: (\d+)/)?.[1];
      if (!contactId) throw new Error("Could not extract contact ID from duplicate error");
    } else {
      console.error("❌ HubSpot contact error:", contactResult);
      throw new Error("HubSpot contact creation failed");
    }
  } else {
    contactId = contactResult.id;
  }

  // ✅ Step 2: Create campaign submission object
  const submissionResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_ID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        campaign_name: `${brandName} – "${creativeHook}"`,
        brand_name: brandName,
        firebase_id: firebaseId || "",
        promotion_type: promotionType || "Not specified",
        creative_hook: creativeHook || "",
        category: category || "Not specified",
        submitted_at: new Date().toISOString(),
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 3, // Contact → Custom Object
            },
          ],
        },
      ],
    }),
  });

  const submissionResult = await submissionResponse.json();

  if (!submissionResponse.ok) {
    console.error("❌ Failed to create campaign submission:", submissionResult);
    throw new Error("HubSpot campaign submission failed");
  }

  console.log("✅ HubSpot campaign submission created:", submissionResult.id);
  return {
    contactId,
    campaignSubmissionId: submissionResult.id,
  };
}

module.exports = { createCampaignSubmission };

