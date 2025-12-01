"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  Users,
  Stethoscope,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalVisits: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();
        if (data.success) {
          setStats({
            totalUsers: data.stats.totalUsers,
            totalDoctors: data.stats.totalDoctors,
            totalAppointments: data.stats.totalAppointments,
            totalVisits: data.stats.totalVisits,
          });
        }
      } catch (err) {
        console.log("Error loading stats", err);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex bg-backgroundLight">

      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-primary h-screen text-white flex flex-col transition-all duration-300 fixed lg:static z-40`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className={`flex items-center gap-2 transition-all ${!sidebarOpen && "hidden"}`}>
            <LayoutDashboard size={24} />
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>

          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-3">
          <SidebarItem
            open={sidebarOpen}
            icon={<Users size={20} />}
            label="Users"
            path="/admin/users"
          />
          <SidebarItem
            open={sidebarOpen}
            icon={<Stethoscope size={20} />}
            label="Doctors"
            path="/admin/doctors"
          />
          <SidebarItem
            open={sidebarOpen}
            icon={<Calendar size={20} />}
            label="Appointments"
            path="/admin/appointments"
          />
          <SidebarItem
            open={sidebarOpen}
            icon={<BarChart3 size={20} />}
            label="Analytics"
            path="/admin/analytics"
          />
          <SidebarItem
            open={sidebarOpen}
            icon={<Settings size={20} />}
            label="Settings"
            path="/admin/settings"
          />
        </nav>

        {/* Logout */}
        <button className="flex items-center gap-3 p-4 text-white/80 hover:bg-red-500 transition rounded-xl m-4">
          <LogOut size={20} />
          <span className={`${!sidebarOpen && "hidden"} text-sm font-medium`}>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:ml-0 ml-20">
        {/* TOPBAR */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Dashboard Overview</h2>

          <div className="flex items-center gap-3">
            <img
              src="/default-image.avif"
              className="w-10 h-10 rounded-full border object-cover"
              alt="Admin Avatar"
            />
            <span className="font-medium text-gray-700 hidden md:block">
              Admin Account
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <DashboardCard title="Total Users" value={stats.totalUsers} icon={<Users />} />
          <DashboardCard title="Doctors" value={stats.totalDoctors} icon={<Stethoscope />} />
          <DashboardCard title="Appointments" value={stats.totalAppointments} icon={<Calendar />} />
          <DashboardCard title="Monthly Visits" value={stats.totalVisits} icon={<BarChart3 />} />
        </div>

        {/* Analytics Box */}
        <div className="bg-white mt-10 p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Analytics Overview</h3>
          <p className="text-gray-600 text-sm">
            Charts and analytics will appear here once backend API is connected.
          </p>
        </div>
      </main>
    </div>
  );
}

/* SIDEBAR ITEM */
function SidebarItem({ icon, label, open, path }) {
  const router = useRouter();
  const currentPath = usePathname();
  const isActive = currentPath === path;

  return (
    <button
      onClick={() => router.push(path)}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition
        ${isActive ? "bg-primaryLight shadow-md" : "hover:bg-primaryLight"}
      `}
    >
      {icon}
      <span className={`${!open && "hidden"} text-sm font-medium`}>{label}</span>
    </button>
  );
}

/* DASHBOARD CARD */
function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h3 className="text-3xl font-semibold text-gray-800 mt-1">{value}</h3>
      </div>

      <div className="bg-primaryLight text-white p-3 rounded-xl">
        {icon}
      </div>
    </div>
  );
}
