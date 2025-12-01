"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";

export default function PasswordUpdate({ contactType, contactValue, onUpdated }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setUpdating(true);

      const { data } = await api.post("/auth/update-password", {
        contactType,
        contactValue,
        password,
        role: "user",
      });

      if (!data.success) {
        toast.error(data.message || "Failed to update password.");
        setUpdating(false);
        return;
      }

    //   toast.success(data.message || "Password updated successfully!");
      onUpdated(); // Callback to page.js to redirect user to login
    } catch (err) {
      console.error("Password Update Error:", err);
      toast.error(err?.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <label className="text-gray-700 text-sm">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mt-1 p-3 border border-gray-200 bg-gray-50 rounded-xl
                     focus:ring-2 focus:ring-primaryLight outline-none"
        />
      </div>

      <div>
        <label className="text-gray-700 text-sm">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full mt-1 p-3 border border-gray-200 bg-gray-50 rounded-xl
                     focus:ring-2 focus:ring-primaryLight outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={updating}
        className="w-full bg-primary text-white py-3 rounded-xl text-lg font-medium 
                   hover:bg-primaryLight transition disabled:opacity-60"
      >
        {updating ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
