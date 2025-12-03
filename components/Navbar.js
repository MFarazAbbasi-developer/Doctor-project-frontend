"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

import {
  Home,
  User,
  Hospital,
  ShoppingCart,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Search,
  Info,
  Mail,
} from "lucide-react";
import { getProfileImage } from "@/utils/getProfileImage";

export default function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = () => {
    if (!searchInput.trim()) return; // don't search empty
    router.push(
      `/find-doctors?search=${encodeURIComponent(
        searchInput.trim()
      )}&sort=mostExperienced`
    );
    setSearchOpen(false); // close the search overlay
    setSearchInput(""); // optional: reset input after search
  };

  const searchInputRef = useRef(null);

  // Focus the input whenever searchOpen becomes true
  useEffect(() => {
    if (searchOpen) {
      // small delay to wait for animation
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading, isAuthenticated, setIsAuthenticated, setUser, role } =
    useAuth();

  const dropdownRef = useRef(null);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      router.push("/");
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      setSearchOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/find-doctors", label: "Find Doctors" },
    { href: "/hospitals", label: "Hospitals" },
    // { href: "/medicines", label: "Medicines" },
    // { href: "/surgeries", label: "Surgeries" },
    // { href: "/facilities", label: "Facilities" },
    // { href: "/about-us", label: "About Us" },
    // { href: "/contact-us", label: "Contact Us" },
    // { href: "/help", label: "Help" },
  ];

  const bottomNav = [
    { label: "Home", icon: <Home size={22} />, path: "/" },
    { label: "Doctors", icon: <User size={22} />, path: "/find-doctors" },
    { label: "Hospital", icon: <Hospital size={22} />, path: "/hospitals" },
    // { label: "Medicine", icon: <ShoppingCart size={22} />, path: "/medicines" },
    // { label: "About Us", icon: <Info size={22} />, path: "/about-us" },
    // { label: "Contact Us", icon: <Mail size={22} />, path: "/contact-us" },
    // { label: "Help", icon: <HelpCircle size={22} />, path: "/help" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
const [signupOpen, setSignupOpen] = useState(false)
const [loginOpen, setLoginOpen] = useState(false)
const signupDropdownRef = useRef(null);
useEffect(() => {
  const handleClickOutside = (e) => {
    if (signupDropdownRef.current && !signupDropdownRef.current.contains(e.target)) {
      setSignupOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <>
      {/* TOP NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Hamburger */}
            <button
              onClick={() => {
                setMobileMenuOpen(true);
                setSearchOpen(false);
              }}
              className="md:hidden text-primary"
            >
              <Menu className="w-7 h-7" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              onClick={() => setSearchOpen(false)}
              className="hidden md:block text-2xl font-bold text-primaryLight tracking-wide hover:opacity-80"
            >
              Logo
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => (
                <Link
                  onClick={() => setSearchOpen(false)}
                  key={item.href}
                  href={item.href}
                  className={`relative text-[15px] font-medium transition ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-[#1B3C74] hover:text-primary"
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side: Profile / Auth / Search */}
            <div className="flex items-center gap-3">
              {/* Small toggleable search input */}
              <div
                className="relative flex items-center"
                ref={searchContainerRef}
              >
                {/* Search Icon */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-2 rounded-md hover:bg-gray-200 transition md:p-3 ${
                    searchOpen ? "opacity-0" : ""
                  }`}
                >
                  <Search className="w-5 h-5 text-primary" />
                </button>

                {/* Animated search input */}
                <div
                  className={`absolute right-0 top-0 transform transition-all duration-300 ease-out origin-right ${
                    searchOpen
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0"
                  }`}
                >
                  <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-lg overflow-hidden w-64 md:w-72">
                    <input
                      type="text"
                      ref={searchInputRef}
                      placeholder="Search doctors, hospitals, medicines..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1 px-4 py-2 text-sm md:text-base outline-none"
                    />
                    <button
                      onClick={handleSearch}
                      className="text-primaryLight px-4 py-2 hover:text-primary transition"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Login/Signup buttons for desktop */}
              {!loading && !isAuthenticated && (
                <div className="relative flex items-center gap-3">

  {/* SIGN UP WITH DROPDOWN */}
  <div className="relative hidden lg:block" ref={signupDropdownRef}>
    <button
      onClick={() => setSignupOpen(!signupOpen)}
      className="px-4 py-2 border border-primaryLight text-primaryLight rounded-lg hover:bg-primaryLight hover:text-white transition  flex items-center gap-1"
    >
      Sign Up
      <svg
        className={`w-3 h-3 transition-transform ${signupOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {signupOpen && (
      <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <Link
          href="/signup"
          onClick={() => setSignupOpen(false)}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
        >
          As a Patient
        </Link>
        <Link
          href="/signup?role=doctor"
          onClick={() => setSignupOpen(false)}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
        >
          As a Doctor
        </Link>
      </div>
    )}
  </div>

  {/* LOGIN BUTTON */}
  <Link
    href="/login"
    className="px-4 py-2 bg-primaryLight text-white rounded-lg hover:bg-primary transition"
  >
    Login
  </Link>

</div>


              )}

              {/* User menu when authenticated */}
              {!loading && isAuthenticated && (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => {
                      setUserMenuOpen(!userMenuOpen);
                      setMobileMenuOpen(false);
                      setSearchOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={user?.profileImage || "/default-image.avif"}
                      alt="User"
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-primaryLight"
                      onError={(e) => {
                        e.currentTarget.src = "/default-image.avif"; // fallback image
                      }}
                    />
                    {/* <ChevronDown className="text-primary" /> */}
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg py-2 z-50">
                      {role === "user" && (
                        <Link
                          href="/profile/edit"
                          onClick={() => setUserMenuOpen(false)}
                          className="px-4 block py-2 hover:bg-primaryLight hover:text-white transition"
                        >
                          Edit Profile
                        </Link>
                      )}
                      {role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="px-4 block py-2 hover:bg-primaryLight hover:text-white transition"
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="px-4 py-2 w-full text-left text-red-500 hover:bg-red-100 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-4 right-4 text-primary"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Scrollable menu */}
        <div className="mt-16 px-4 overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar space-y-3">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2 text-[17px] ${
                pathname === item.href ? "text-primary" : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {!isAuthenticated && (
            <>
              <Link
                href="/signup"
                className="block py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join as Doctor
              </Link>
              <Link
                href="/signup"
                className="block py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="block py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </>
          )}

          <div className="h-16"></div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 h-16 flex justify-around items-center shadow-inner z-50">
        {bottomNav.map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                setMobileMenuOpen(false);
                router.push(item.path);
              }}
              className="flex flex-col items-center justify-center"
            >
              <span className={active ? "text-primary" : "text-gray-500"}>
                {item.icon}
              </span>
              <span
                className={`text-xs mt-1 ${
                  active ? "text-primary font-semibold" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Custom scrollbar */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #c7d9ff #ffffff;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #ffffff;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #b3c7ff;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8fb0ff;
        }
      `}</style>
    </>
  );
}
