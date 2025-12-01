"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Edit } from "lucide-react";

const ViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/admin/users/${id}`);
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading user...</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  return (
<div className="px-6 lg:px-20 py-10 max-w-4xl mx-auto">
  {/* Action Buttons */}
  <div className="flex justify-between items-center mb-6">
    <button
      type="button"
      onClick={() => router.push("/admin/users")}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back to Users</span>
    </button>

    <button
      type="button"
      onClick={() => router.push(`/admin/users/${user._id}/edit`)}
      className="flex items-center gap-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-500 hover:text-white px-4 py-2 rounded-lg transition"
    >
      <Edit className="w-5 h-5" />
      <span>Edit User</span>
    </button>
  </div>

  <h1 className="text-3xl font-bold text-primary mb-6 text-center">User Details</h1>

  {/* Modern Card */}
  <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Profile */}
    <div className="flex flex-col items-center  md:col-span-1 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6">
      {user.profileImage ? (
        <img
          src={process.env.NEXT_PUBLIC_API_IMAGE + user.profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-primaryLight"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <span className="text-gray-400 font-bold text-xl">N/A</span>
        </div>
      )}
      <h2 className="text-xl font-semibold text-gray-800">{user.name.firstName} {user.name.lastName}</h2>
      <p className="text-gray-500">{user.email}</p>
    </div>

    {/* Info */}
    <div className="flex flex-col justify-between gap-3">
      <div className="grid grid-cols-2 gap-4">
        <p className="text-gray-600 font-medium">Phone:</p>
        <p className="text-gray-800">{user.phoneNumber}</p>

        <p className="text-gray-600 font-medium">NIC:</p>
        <p className="text-gray-800">{user.nicNumber}</p>

        <p className="text-gray-600 font-medium">Gender:</p>
        <p className="text-gray-800">{user.gender}</p>

        <p className="text-gray-600 font-medium">Role:</p>
        <p className="text-gray-800">{user.role}</p>

        <p className="text-gray-600 font-medium">Status:</p>
        <p className={`font-semibold ${user.isBlocked ? "text-red-500" : "text-green-500"}`}>
          {user.isBlocked ? "Blocked" : "Active"}
        </p>

        <p className="text-gray-600 font-medium">Account Verified:</p>
        <p className="text-gray-800">{user.isAccountVerified ? "Yes" : "No"}</p>

        <p className="text-gray-600 font-medium">Email Verified At:</p>
        <p className="text-gray-800">{user.emailVerifiedAt ? new Date(user.emailVerifiedAt).toLocaleString("en-PK") : "N/A"}</p>

        <p className="text-gray-600 font-medium">Created At:</p>
        <p className="text-gray-800">
          {new Date(user.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
    </div>
  </div>
</div>

  );
};

export default ViewUser;
