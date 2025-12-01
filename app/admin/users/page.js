"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Eye, Edit, Ban, Unlock, Trash, Plus } from "lucide-react";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest"); // default sort

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/users", {
        params: {
          page: currentPage,
          limit: usersPerPage,
          sort,
        },
      });
      if (data.success) {
        setUsers(data.users);
        setTotalPages(Math.ceil(data.total / usersPerPage));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sort]);

  // Filtered and paginated users
  const filteredUsers = users.filter(
    (u) =>
      u.name.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.name.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.nicNumber.includes(search)
  );

  const paginatedUsers = filteredUsers
  // .slice(
  //   (currentPage - 1) * usersPerPage,
  //   currentPage * usersPerPage
  // );
  // Handle Block / Unblock
  const handleBlockToggle = async (userId, isBlocked) => {
    try {
      // const endpoint = isBlocked
      //   ? `/admin/users/unblock/${userId}`
      //   : `/admin/users/block/${userId}`;

      // const { data } = await api.put(endpoint);
      const { data } = await api.patch(`/admin/users/block/${userId}`);

      if (data.success) {
        // Update local state
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isBlocked: !isBlocked } : u
          )
        );

        // Show toast
        toast.success(
          `User has been ${isBlocked ? "unblocked" : "blocked"} successfully!`
        );
      }
    } catch (err) {
      console.error("Failed to toggle block:", err);

      toast.error("Failed to toggle block. Please try again.");
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const { data } = await api.delete(`/admin/users/delete/${userToDelete}`);
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userToDelete));
        toast.success("User deleted successfully!");
      }
    } catch (err) {
      // console.error("Failed to delete user:", err);

      // Show backend error if available
      const msg =
        err.response?.data?.message ||
        "Failed to delete user. Please try again.";

      toast.error(msg);
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading users...</p>;

  return (
    <div className="px-6 lg:px-20 py-10">
      <h1 className="text-3xl font-bold text-primary mb-6">User Management</h1>

      {/* Controls: Search + Sort + Add User*/}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, email, NIC..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page
          }}
          className="w-full md:w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Controls: Sort + Add User */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1); // reset page
            }}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>

          {/* Add User Button */}
          <Link
            href="/admin/users/add"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryLight transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add User</span>
          </Link>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead className="bg-primaryLight text-white">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">NIC</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{`${user.name.firstName} ${user.name.lastName}`}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.nicNumber}</td>
                <td className="py-2 px-4">{user.phoneNumber}</td>
                <td className="py-2 px-4">
                  {user.isBlocked ? (
                    <span className="text-red-500 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-500 font-semibold">Active</span>
                  )}
                </td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    {/* View User */}
                    <Link
                      href={`/admin/users/${user._id}`}
                      title="View User"
                      className="p-2 rounded-full bg-backgroundLight text-primary hover:bg-primary hover:text-white transition"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>

                    {/* Edit User */}
                    <Link
                      href={`/admin/users/${user._id}/edit`}
                      title="Edit User"
                      className="p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-500 hover:text-white transition"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>

                    {/* Block / Unblock User */}
                    <button
                      onClick={() =>
                        handleBlockToggle(user._id, user.isBlocked)
                      }
                      title={user.isBlocked ? "Unblock User" : "Block User"}
                      className={`p-2 rounded-full transition ${
                        user.isBlocked
                          ? "bg-green-100 text-green-700 hover:bg-green-500 hover:text-white"
                          : "bg-red-100 text-red-700 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      {user.isBlocked ? (
                        <Unlock className="w-5 h-5" />
                      ) : (
                        <Ban className="w-5 h-5" />
                      )}
                    </button>

                    {/* Delete User */}
                    {/* <button
                      onClick={() => confirmDelete(user._id)}
                      title="Delete User"
                      className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white transition"
                    >
                      <Trash className="w-5 h-5" />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Delete User
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
