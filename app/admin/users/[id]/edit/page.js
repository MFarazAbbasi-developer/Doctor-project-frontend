"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { ArrowLeft, Edit } from "lucide-react";
import { getProfileImage } from "@/utils/getProfileImage";

const EditUser = () => {
  const { id } = useParams(); // user ID
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    profileImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user details
  const fetchUser = async () => {
    try {
      const { data } = await api.get(`/admin/users/${id}`);
      if (data.success) {
        const user = data.user;
        setFormData({
          firstName: user.name.firstName,
          lastName: user.name.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          nicNumber: user.nicNumber,
          gender: user.gender,
          role: user.role,
          isBlocked: user.isBlocked,
          isAccountVerified: user.isAccountVerified,
          profileImage: null,
        });
        setImagePreview(
          (user.profileImage) ||
            null
        );
        console.log(
          `File path: ${process.env.NEXT_PUBLIC_API_IMAGE}${user.profileImage}`
        );
      }
    } catch (err) {
      // console.error(err);

      // Show backend error if available
      const msg = err.response?.data?.message || "Failed to fetch user data";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("firstName", formData.firstName);
      payload.append("lastName", formData.lastName);
      payload.append("email", formData.email);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("nicNumber", formData.nicNumber);
      payload.append("gender", formData.gender);
      payload.append("role", formData.role);
      payload.append("isBlocked", formData.isBlocked);
      payload.append("isAccountVerified", formData.isAccountVerified);
      if (formData.profileImage) {
        payload.append("profileImage", formData.profileImage);
      }

      const { data } = await api.put(`/admin/users/edit/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("User updated successfully");
        // router.push("/admin/users");
        router.push(`/admin/users/${id}`);
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch (err) {
      // console.error(err);

      // Show backend error if available
      const msg =
        err.response?.data?.errors?.map((e) => e.msg).join(", ") ||
        err.response?.data?.message ||
        "Something went wrong while updating user";

      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading user...</p>;

  return (
    <div className="px-6 lg:px-20 py-10 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push("/admin/users")}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Users</span>
      </button>

      <h1 className="text-3xl font-bold text-primary mb-6 text-center">
        Edit User
      </h1>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6 relative">
          <div className="relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-primaryLight"
                onError={(e) => {
                  e.currentTarget.src = "/default-image.avif"; // fallback image
                }}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-primaryLight">
                <span className="text-gray-400 font-bold text-xl">N/A</span>
              </div>
            )}

            {/* Edit Icon Overlay */}
            <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer hover:bg-primaryLight transition">
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <Edit className="w-5 h-5 text-white" />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
          />

          {/* Phone Number */}
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
          />

          {/* NIC Number */}
          <input
            type="text"
            name="nicNumber"
            placeholder="NIC Number"
            value={formData.nicNumber}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
          />

          {/* Gender & Role */}
          <div className="flex flex-col md:flex-row gap-4">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="flex flex-col md:flex-row gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isBlocked"
                checked={formData.isBlocked}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Blocked</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAccountVerified"
                checked={formData.isAccountVerified}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Account Verified</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryLight transition font-semibold mt-4"
          >
            {submitting ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
