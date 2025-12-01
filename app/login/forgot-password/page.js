"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "@/lib/api";

import EmailForm from "./EmailForm";
import OTPVerify from "./OTPVerify";
import PasswordUpdate from "./PasswordUpdate";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step: "email" -> EmailForm, "verify" -> OTPVerify, "update" -> PasswordUpdate
  const [step, setStep] = useState("email");

  // contact info (type: "email" | "phone" ; value string)
  const [contactType, setContactType] = useState("email");
  const [contactValue, setContactValue] = useState("");

  // resend cooldown state
  const RESEND_COOLDOWN = 60; // seconds before resend allowed
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [resendAllowed, setResendAllowed] = useState(false);
  const [sending, setSending] = useState(false);

  const timerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // start resend countdown
  const startResendTimer = (seconds = RESEND_COOLDOWN) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(seconds);
    setResendAllowed(false);

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setResendAllowed(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  // Send OTP (used both initial send and resend)
  // contactType expected "email" or "phone" (phone currently commented server-side)
  const sendOtp = async ({ contactType: type, contactValue: value }) => {
    try {
      setSending(true);

      // Basic front validation
      if (!type || !value) {
        toast.error("Please provide a valid email or phone.");
        setSending(false);
        return null;
      }

      const payload = {
        contactType: type,
        contactValue: value,
        role: "user",
      };

      const { data } = await api.post("/auth/forgot-password", payload);

      if (!data || !data.success) {
        toast.error(data?.message || "Failed to send OTP. Try again.");
        setSending(false);
        return null;
      }

      // success -> move to verify step and start timer
      setContactType(type);
      setContactValue(value);
      setStep("verify");
      startResendTimer(); // start cooldown
      toast.success(data.message || "OTP sent. Check your inbox.");

      setSending(false);
      return data;
    } catch (err) {
      console.error("sendOtp error:", err);
      toast.error(
        err?.response?.data?.message || "Unable to send OTP. Try again."
      );
      setSending(false);
      return null;
    }
  };

  // resend wrapper (disabled while cooldown)
  const handleResend = async () => {
    if (!resendAllowed && secondsLeft > 0) {
      return;
    }
    // Re-send to same contact
    await sendOtp({ contactType, contactValue });
  };

  // Called by OTPVerify when OTP validation succeeds
  // Move to password update step
  const handleVerified = () => {
    setStep("update");
    // Stop timer (not strictly needed, but safe)
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setResendAllowed(false);
    setSecondsLeft(0);
  };

  // Called by PasswordUpdate on successful password update
  const handlePasswordUpdated = () => {
    toast.success("Password updated. Please login with your new password.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-backgroundLight px-4 py-12">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* LEFT IMAGE SECTION */}
        <div className="lg:w-[40%] bg-primaryLight text-white p-10 flex flex-col justify-between relative hidden lg:flex">
          <h1 className="text-4xl font-bold mb-8">Hospital <span className="font-light">Logo</span></h1>
          <div className="flex justify-center items-end h-full">
            <img
              src="/2-doctors.png"
              alt="Doctors"
              className="lg:absolute bottom-0 w-[80%] md:w-[70%] lg:w-[85%] object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="lg:w-[60%] flex justify-center items-center p-8 md:p-16 w-full">
          <div className="w-full max-w-md">

            {/* Header & step title */}
            <div className="mb-6 text-center lg:text-left">
              {step === "email" && (
                <>
                  <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">Forgot Password</h2>
                  <p className="text-sm text-gray-600">Enter your email or phone to receive OTP and reset password.</p>
                </>
              )}
              {step === "verify" && (
                <>
                  <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">Verify OTP</h2>
                  <p className="text-sm text-gray-600">Enter the code sent to <span className="font-medium">{contactValue}</span></p>
                </>
              )}
              {step === "update" && (
                <>
                  <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">Set New Password</h2>
                  <p className="text-sm text-gray-600">Create a new secure password for your account.</p>
                </>
              )}
            </div>

            {/* Step content */}
            {step === "email" && (
              <EmailForm
                onSubmit={async ({ contactType: type, contactValue: value }) =>
                  await sendOtp({ contactType: type, contactValue: value })
                }
                sending={sending}
              />
            )}

            {step === "verify" && (
              <OTPVerify
                contactType={contactType}
                contactValue={contactValue}
                onVerified={handleVerified}
                resendAllowed={resendAllowed}
                secondsLeft={secondsLeft}
                onResend={handleResend}
              />
            )}

            {step === "update" && (
              <PasswordUpdate
                contactType={contactType}
                contactValue={contactValue}
                onUpdated={handlePasswordUpdated}
              />
            )}

            {/* small navigation hint when not on initial */}
            {step !== "email" && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    // allow user to go back to initial step to re-enter contact
                    setStep("email");
                    setContactType("email");
                    setContactValue("");
                    if (timerRef.current) {
                      clearInterval(timerRef.current);
                      timerRef.current = null;
                    }
                    setSecondsLeft(0);
                    setResendAllowed(false);
                  }}
                  className="text-sm text-primaryLight hover:underline"
                >
                  Edit contact info
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
