"use client";

import { useState } from "react";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

export default function EmailForm({ onSubmit, sending }) {
  const [contactType, setContactType] = useState("email"); // "email" | "phone"
  const [contactValue, setContactValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!contactValue.trim()) return;

    onSubmit({ contactType, contactValue });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Toggle Email / Phone */}
      <div className="flex items-center justify-center gap-4 mb-2">
        <button
          type="button"
          onClick={() => {setContactType("email"); setContactValue("")}}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            contactType === "email"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Email
        </button>

        <button
          type="button"
          onClick={() => {setContactType("phone"); setContactValue("")}}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            contactType === "phone"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Phone
        </button>
      </div>

      {/* Input Field */}
      <div>
        <label className="text-gray-700 text-sm">
          {contactType === "email" ? "Email Address" : "Phone Number"}
        </label>

        <input
          type={contactType === "email" ? "email" : "tel"}
          placeholder={contactType === "email" ? "you@example.com" : "03XX-XXXXXXX"}
          required
          value={contactValue}
          onChange={(e) => {
            if (contactType === "phone") {
              setContactValue(formatPhoneNumber(e.target.value));
            } else {
              setContactValue(e.target.value);
            }
          }}
          className="w-full mt-1 p-3 border border-gray-200 bg-gray-50 rounded-xl
                     focus:ring-2 focus:ring-primaryLight outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={sending}
        className="w-full bg-primary text-white py-3 rounded-xl text-lg font-medium 
                   hover:bg-primaryLight transition disabled:opacity-60"
      >
        {sending ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );
}
