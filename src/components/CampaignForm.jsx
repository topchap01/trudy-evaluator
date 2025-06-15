// Trudy-Styled CampaignForm.jsx with Trevor Branding, Pagination, and reCAPTCHA + Embedded Link
import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const hints = {
  firstName: "We'll use this to personalise your evaluation.",
  lastName: "Optional, but helpful.",
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
  country: "Country matters – legal rules and cultural context.",
};

const CampaignForm = () => {
  const [page, setPage] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
    country: "",
    extraDetails: "",
  });

  const requiredFields = [
    "firstName", "email", "company", "brandName", "category", "objective",
    "targetAudience", "promotionType", "offer", "creativeHook", "entryMechanic",
    "prizeInfo", "budget", "channels", "startDate", "endDate", "country"
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

  const handleSubmit = async (recaptchaToken) => {
    if (!validateForm()) return;
    const fullData = { ...formData, recaptchaToken };
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "campaigns"), {
        ...formData,
        evaluationHtml: "",
        createdAt: serverTimestamp(),
      });
      await fetch("/api/sendToHubspot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting campaign:", error);
      alert("Failed to submit campaign.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateCurrentPage = () => {
    const pageFieldGroups = {
      1: ["firstName", "email", "company"],
      2: ["brandName", "category", "objective", "targetAudience"],
      3: ["promotionType", "offer", "creativeHook", "entryMechanic"],
      4: ["prizeInfo", "budget", "channels", "startDate", "endDate"],
      5: ["country"],
    };
    const fieldsToCheck = pageFieldGroups[page];
    const newErrors = {};
    fieldsToCheck.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required.";
      }
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const nextPage = () => {
    const isValid = validateCurrentPage();
    if (isValid) setPage((p) => p + 1);
  };

  const prevPage = () => {
    setPage((p) => p - 1);
  };

  const renderInput = (name, label, placeholder, type = "text") => (
    <div>
      <label className="block text-lg font-semibold text-gray-800 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        className={`w-full border rounded-md p-3 placeholder-gray-400 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
      />
      {hints[name] && <p className="text-sm text-gray-500 italic mt-1">{hints[name]}</p>}
      {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  useEffect(() => {
    const loadRecaptcha = () => {
      if (!window.grecaptcha) {
        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
        script.async = true;
        document.body.appendChild(script);
      }
    };
    loadRecaptcha();
  }, []);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center px-4">
        <div className="max-w-xl w-full space-y-6">
          <h1 className="text-3xl font-bold text-[#b30000]">Thank You!</h1>
          <p className="text-gray-700 text-lg">Your campaign has been submitted successfully.</p>
          <p className="text-gray-600">Please check your email soon for the completed evaluation.</p>
          <a href="https://trevor.services" className="inline-block mt-4 text-[#b30000] underline font-medium hover:text-red-800 transition">← Back to Trevor.Services</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-10 space-y-10">
        <h1 className="text-4xl font-bold text-left text-[#b30000] tracking-tight">Trudy Evaluation</h1>
        <p className="text-md text-gray-600 leading-relaxed">
          Submit your campaign to receive an expert evaluation direct to your inbox. 
        </p>

        {isSubmitting ? (
          <div className="text-center text-lg font-medium text-gray-700">
            Generating your evaluation…<br />Please check your email shortly.
          </div>
        ) : (
          <form onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} className="space-y-8">
            {page === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput("firstName", "First Name", "e.g. Joanna")}
                  {renderInput("lastName", "Last Name", "Optional")}
                </div>
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
                              <option value="Electronics / Gaming">Electronics / Gaming</option>
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
                          {renderInput("offer", "Offer", "e.g. $50 cashback or 2-for-1 deal")}
                          {renderInput("creativeHook", "Creative Hook", "e.g. Win a Year Off")}
                          {renderInput("entryMechanic", "Entry Mechanic", "e.g. Upload receipt")}
                        </div>
                      )}
          
                      {page === 4 && (
                        <div className="space-y-4">
                          {renderInput("prizeInfo", "Prize Info", "e.g. $10K prize")}
                          {renderInput("budget", "Media Budget", "e.g. AUD $75,000")}
                          {renderInput("channels", "Media Channels", "e.g. Social, in-store")}
                          {renderInput("startDate", "Start Date", "", "date")}
                          {renderInput("endDate", "End Date", "", "date")}
                        </div>
                      )}
          
                      {page === 5 && (
                        <div className="space-y-4">
                          {renderInput("retailer", "Retailer(s)", "e.g. Woolworths")}
                          {renderInput("tradeIncentive", "Trade Incentive", "e.g. Store rewards")}
                          <div>
                            <label className="block text-lg font-semibold text-gray-800 mb-1">Country</label>
                            <select
                              name="country"
                              value={formData.country}
                              onChange={handleChange}
                              className={`w-full border rounded-md p-2 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                            >
                              <option value="">Select country</option>
                              <option value="Australia">Australia</option>
                              <option value="New Zealand">New Zealand</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="United States">United States</option>
                              <option value="Singapore">Singapore</option>
                              <option value="Greece">Greece</option>
                              <option value="Spain">Spain</option>
                            </select>
                            {hints.country && <p className="text-sm text-gray-500 italic mt-1">{hints.country}</p>}
                            {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
                          </div>
                          <div>
                            <label htmlFor="extraDetails" className="block text-sm font-medium text-gray-700 mb-1">Final Clarification or Elevation</label>
                            <div className="text-sm text-gray-500 mb-2">
                              <p className="mb-2">Use this space to clarify anything not captured above — or to highlight what makes your campaign smart, distinctive, or potentially award-winning.</p>
                              <p className="text-gray-400">Prompts to guide you:</p>
                              <ul className="list-disc ml-5 text-sm text-gray-400 mt-1 space-y-1">
                                <li>If this is a <strong>cashback</strong>, what’s the product’s purchase price?</li>
                                <li>If this is a <strong>gift with purchase</strong>, what’s the value of the gift and the item being bought?</li>
                                <li>If this is a <strong>prize draw</strong>, outline any details of the major prize or lower tiers not already included above.</li>
                                <li>If the mechanic or strategy is unconventional, briefly describe how it works.</li>
                                <li>If this campaign has won — or deserves to win — an award, explain why.</li>
                              </ul>
                            </div>
                            <textarea
                              id="extraDetails"
                              name="extraDetails"
                              placeholder="Add any final clarification or insight to help Trudy evaluate your campaign more effectively..."
                              value={formData.extraDetails || ""}
                              onChange={handleChange}
                              className="w-full mt-2 border border-gray-300 bg-white text-black rounded p-2"
                              rows="5"
                            />
                          </div>
                        </div>
                      )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center w-full">
              {page > 1 && (
                <button
                  type="button"
                  onClick={prevPage}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
              )}
              {page < 5 ? (
                <button
                  type="button"
                  onClick={nextPage}
                  className="bg-red-600 text-white py-2 px-4 rounded-md"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    const isValid = validateForm();
                    if (!isValid) return;

                    if (!window.grecaptcha || !window.grecaptcha.execute) {
                      alert('reCAPTCHA is not ready yet. Please wait a few seconds and try again.');
                      return;
                    }

                    const token = await window.grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: 'submit' });
                    if (!token) {
                      alert('Please complete the reCAPTCHA before submitting.');
                      return;
                    }

                    await handleSubmit(token);
                  }}
                  className="bg-green-600 text-white py-2 px-4 rounded-md"
                >
                  Submit
                </button>
              )}
            </div>
            <p className="text-sm text-center text-gray-500 mt-4">Page {page} of 5</p>
          </form>
        )}
      </div>
    </div>
  );
};

export default CampaignForm;
