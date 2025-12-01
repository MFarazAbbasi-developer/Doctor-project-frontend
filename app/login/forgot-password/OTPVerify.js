"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";

export default function OTPVerify({
  contactType,
  contactValue,
  resendAllowed,
  secondsLeft,
  onResend,
  onVerified,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);

  const inputRefs = useRef([]);

  // Auto move to next input
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        const updated = [...otp];
        updated[index] = "";
        setOtp(updated);
      }
    }
  };

  // Paste full OTP
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5].focus();
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Enter complete 6-digit OTP.");
      return;
    }

    try {
      setVerifying(true);

      const { data } = await api.post("/auth/verify-otp", {
        contactType,
        contactValue,
        otp: code,
        role: "user",
      });

      if (!data.success) {
        toast.error(data.message || "Invalid OTP");
        setVerifying(false);
        return;
      }

      toast.success("OTP Verified!");
      onVerified(); // Move to password update step
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">


      {/* OTP boxes */}
      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-xl font-semibold border border-gray-300
                       rounded-xl focus:ring-2 focus:ring-primaryLight outline-none 
                       bg-gray-50"
          />
        ))}
      </div>

      {/* Timer / Resend */}
      <div className="text-center mt-2">
        {secondsLeft > 0 ? (
          <p className="text-gray-600 text-sm">
            Resend OTP in{" "}
            <span className="font-medium text-primaryLight">{secondsLeft}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={!resendAllowed}
            className="text-primaryLight text-sm font-medium hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={verifying || otp.join("").length !== 6}  //  Disabled until 6 digits
        className="w-full bg-primary text-white py-3 rounded-xl text-lg font-medium 
                   hover:bg-primaryLight transition disabled:opacity-60"
      >
        {verifying ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
}
