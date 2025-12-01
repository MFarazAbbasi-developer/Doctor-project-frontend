"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Edit } from "lucide-react";
import { formatNIC } from "@/utils/formatNIC";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

const AddUser = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nicNumber: "",
    gender: "male",
    role: "user",
    isBlocked: false,
    isAccountVerified: false,
    password: "",
    profileImage: null,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      // setFormData({ ...formData, [name]: value });
      let newValue = value;

      if (name === "nicNumber") {
        newValue = formatNIC(value);
      }
      if (name === "phoneNumber") {
        newValue = formatPhoneNumber(value);
      }

      setFormData({
        ...formData,
        [name]: newValue,
      });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      });

      const { data } = await api.post("/admin/users/add", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("User added successfully!");
        router.push(`/admin/users/${data.user?._id}`);
      } else {
        toast.error(data.message || "Failed to add user");
      }
    } catch (err) {
      //   console.error(err);
      // Show backend error if available
      if (err.response?.data?.errors.length > 0) {
        err.response?.data?.errors.map((error) => toast.error(error));
      } else {
        const msg =
          err.response?.data?.message ||
          "Something went wrong while adding user";

        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6 lg:px-20 py-10 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push("/admin/users")}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Users</span>
      </button>

      <h1 className="text-3xl font-bold text-primary mb-6 text-center">
        Add New User
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6 relative">
          <div className="relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-primaryLight"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 font-bold text-xl">N/A</span>
              </div>
            )}
            {/* Edit Icon Overlay */}
            <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer hover:bg-primaryLight transition">
              <Edit className="w-5 h-5 text-white" />
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        {/* Name */}
        <div className="flex gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Email & Password */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Phone & NIC */}
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          maxLength={11} // 03001234567
          required
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          name="nicNumber"
          placeholder="NIC Number"
          value={formData.nicNumber}
          onChange={handleChange}
          required
          maxLength={15} // CNIC max length with dashes
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Gender & Role */}
        <div className="flex gap-4">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isBlocked"
              checked={formData.isBlocked}
              onChange={handleChange}
            />
            Blocked
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAccountVerified"
              checked={formData.isAccountVerified}
              onChange={handleChange}
            />
            Account Verified
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryLight transition"
        >
          {submitting ? "Adding..." : "Add User"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddUser;
