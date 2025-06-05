import React, { useState, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { callGPT } from "../../lib/openai";

const hints = {
  name: "Who's submitting this? Useful if we need to follow up.",
  email: "We’ll send the evaluation to this address.",
  company: "Helps us contextualise your campaign goals.",
  brandName: "Which brand is being promoted? Be specific.",
  category: "This shapes our evaluation benchmark. Choose wisely.",
  objective: "What are you trying to achieve? Be focused.",
  targetAudience: "Who do you want to reach? Think like a planner.",
  promotionType: "What kind of promotion is this?", 
  offer: "Describe the deal/offer if not a prize-based promo.",
  creativeHook: "The big idea – how are you grabbing attention?",
  entryMechanic: "What's required to participate? Must be clear and fair.",
  prizeInfo: "List all prizes, their value, and how they’ll be awarded.",
  budget: "Your media/activation budget shapes feasibility.",
  channels: "Where will this run? e.g. In-store, Meta, TV.",
  startDate: "Campaign start date.",
  endDate: "Campaign end date.",
  retailer: "Is it retailer-specific? Helps us assess fit.",
  tradeIncentive: "Any extra push for the trade? Detail it.",
  country: "Country matters – legal rules and cultural context."
};

const CampaignForm = () => {
  const [page, setPage] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const submitTriggeredRef = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    brandName: "",
    category: "",
    objective: "",
    targetAudience: "",
    promotionType: "",
    offer: "",
    creativeHook: "",
    entryMechanic: "",
    prizeInfo: "",
    budget: "",
    channels: "",
    startDate: "",
    endDate: "",
    retailer: "",
    tradeIncentive: "",
    country: ""
  });

  const requiredFields = [
    "name", "email", "company", "brandName", "category", "objective", "targetAudience",
    "promotionType", "creativeHook", "entryMechanic", "prizeInfo", "budget", "channels",
    "startDate", "endDate", "country"
  ];

  const validateForm = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitTriggeredRef.current) return;
    if (!validateForm()) return;

    try {
      const evaluationHtml = await callGPT(formData);

      await addDoc(collection(db, "campaigns"), {
        ...formData,
        evaluationHtml,
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting campaign:", error);
      alert("Failed to submit campaign.");
    } finally {
      submitTriggeredRef.current = false;
    }
  };

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => p - 1);

  const renderInput = (name, label, placeholder, type = "text") => (
    <div>
      <label className="block text-lg font-semibold text-gray-800 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        className={`w-full border rounded-md p-2 italic placeholder-gray-400 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
      />
      {hints[name] && <p className="text-sm text-gray-500 italic mt-1">{hints[name]}</p>}
      {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center px-4">
        <div className="max-w-xl w-full space-y-6">
          <h1 className="text-3xl font-bold text-red-600">Thank You!</h1>
          <p className="text-gray-700 text-lg">Your campaign has been submitted successfully.</p>
          <p className="text-gray-600">Please check your email soon for the completed evaluation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center text-red-600">Trudy Campaign Evaluation</h1>

        <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} className="space-y-6">
          {page === 1 && (
            <div className="space-y-4">
              {renderInput("name", "Your Name", "e.g. Joanna Smith")}
              {renderInput("email", "Email Address", "e.g. joanna@example.com", "email")}
              {renderInput("company", "Company", "e.g. Westpac Bank")}
            </div>
          )}

          {page === 2 && (
            <div className="space-y-4">
              {renderInput("brandName", "Brand Name", "e.g. Coca-Cola")}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full border rounded-md p-2 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select category</option>
                  <option value="FMCG">FMCG</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Alcohol">Alcohol</option>
                  <option value="Electronics">Electronics / Gaming</option>
                  <option value="Other">Other</option>
                </select>
                {hints.category && <p className="text-sm text-gray-500 italic mt-1">{hints.category}</p>}
                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
              </div>
              {renderInput("objective", "Campaign Objective", "e.g. Lift Q3 sales by 15%")}
              {renderInput("targetAudience", "Target Audience", "e.g. Students, young families")}
            </div>
          )}

          {page === 3 && (
            <div className="space-y-4">
              {renderInput("promotionType", "Promotion Type", "e.g. Cashback, prize draw")}
              {renderInput("creativeHook", "Creative Hook", "e.g. Win a Year Off")}
              {renderInput("entryMechanic", "Entry Mechanic", "e.g. Upload receipt")}
              {renderInput("prizeInfo", "Prize Info", "e.g. $10K prize")}
            </div>
          )}

          {page === 4 && (
            <div className="space-y-4">
              {renderInput("budget", "Media Budget", "e.g. AUD $75,000")}
              {renderInput("channels", "Media Channels", "e.g. Social, in-store")}
              {renderInput("startDate", "Start Date", "", "date")}
              {renderInput("endDate", "End Date", "", "date")}
              {renderInput("retailer", "Retailer(s)", "e.g. Woolworths")}
              {renderInput("tradeIncentive", "Trade Incentive", "e.g. Store rewards")}
              {renderInput("country", "Country", "e.g. Australia")}
            </div>
          )}

          <div className="flex justify-between items-center">
            {page > 1 && (
              <button type="button" onClick={prevPage} className="text-sm text-gray-600 hover:text-gray-900">
                Back
              </button>
            )}
            {page < 4 ? (
              <button type="button" onClick={nextPage} className="bg-red-600 text-white py-2 px-4 rounded-md">
                Next
              </button>
            ) : (
              <button
                type="submit"
                onClick={() => {
                  submitTriggeredRef.current = true;
                }}
                className="bg-green-600 text-white py-2 px-4 rounded-md"
              >
                Submit
              </button>
            )}
          </div>
          <p className="text-sm text-center text-gray-500 mt-4">Page {page} of 4</p>
        </form>
      </div>
    </div>
  );
};

export default CampaignForm;
