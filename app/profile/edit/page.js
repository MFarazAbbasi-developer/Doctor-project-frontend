"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Edit } from "lucide-react";
import { formatNIC } from "@/utils/formatNIC";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { getProfileImage } from "@/utils/getProfileImage";

export default function EditProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isAuthLoaded, user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nicNumber: "",
    gender: "",
    currentPassword: "",
    newPassword: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("/default-image.avif");
  const [loading, setLoading] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);

  // Fetch current user data
  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/get/${user._id}`);
        const data = res.data.user;
        setFormData({
          firstName: data.name.firstName || "",
          lastName: data.name.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          nicNumber: data.nicNumber || "",
          gender: data.gender || "",
          currentPassword: "",
          newPassword: "",
        });
        setPreview(data.profileImage);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user data");
      }
    };
    fetchUser();
  }, [user, isAuthenticated, isAuthLoaded, router]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phoneNumber") value = formatPhoneNumber(value);
    if (name === "nicNumber") value = formatNIC(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --------------------- Profile Info Submit ---------------------
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("nicNumber", formData.nicNumber);
      data.append("gender", formData.gender);
      if (profileImage) data.append("profileImage", profileImage);

      const res = await api.put(`/user/update/${user._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.map((e) => e.msg).join(", ") ||
        err.response?.data?.message ||
        "Update failed";
      toast.error(msg);
    }

    setLoading(false);
  };

  // --------------------- Password Update Submit ---------------------
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoadingPwd(true);

    if (!formData.currentPassword || !formData.newPassword) {
      toast.error("Please provide both current and new password");
      setLoadingPwd(false);
      return;
    }

    try {
      await api.put(`/user/update-password/${user._id}`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success("Password updated successfully");
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (err) {
      const msg = err.response?.data?.message || "Password update failed";
      toast.error(msg);
    }

    setLoadingPwd(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-backgroundLight px-4 py-8">
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
        <div className="lg:w-[60%] flex flex-col justify-center items-center p-8 md:px-16 w-full space-y-10">

          {/* PROFILE INFO FORM */}
          <div className="w-full max-w-md">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6 text-center flex justify-center lg:text-left">
              Edit Profile
            </h2>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src={preview || "/default-image.avif"}
                    alt="Profile Preview"
                    className="w-28 h-28 rounded-full object-cover border-4 border-primaryLight"
                    onError={(e) => {
                      e.currentTarget.src = "/default-image.avif";
                    }}
                  />
                  <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer hover:bg-primaryLight transition">
                    <input
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Edit className="w-5 h-5 text-white" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryLight outline-none"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryLight outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryLight outline-none"
                  required
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryLight outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nicNumber"
                  value={formData.nicNumber}
                  onChange={handleChange}
                  placeholder="NIC Number"
                  className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryLight outline-none"
                  required
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryLight outline-none"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl text-lg font-medium hover:bg-primaryLight transition"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>

          {/* PASSWORD FORM */}
          <div className="w-full max-w-md">
            {/* <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6 text-center lg:text-left">
              Change Password
            </h2> */}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryLight outline-none"
                required
              />

              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryLight outline-none"
                required
              />
</div>
              <button
                type="submit"
                disabled={loadingPwd}
                className="w-full bg-primary text-white py-3 rounded-xl text-lg font-medium hover:bg-primaryLight transition"
              >
                {loadingPwd ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
