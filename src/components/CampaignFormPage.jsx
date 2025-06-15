import React from "react";
import CampaignForm from "./CampaignForm";

export default function CampaignFormPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-4xl">
        <CampaignForm />
      </div>
    </div>
  );
}
