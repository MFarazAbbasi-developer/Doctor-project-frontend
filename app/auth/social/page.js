"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function SocialLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setIsAuthenticated, setRole } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Google login failed. No token received.");
      router.replace("/login");
      return;
    }

    // ---------------------------
    // Store token in cookie
    // ---------------------------
    // We'll use a simple cookie set (same as manual login)
    // expiry: 7 days
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;

    // ---------------------------
    // Update Auth Context
    // ---------------------------
    // Optionally, you could decode token to extract user info
    // or fetch /auth/me from backend
    setIsAuthenticated(true);
    setRole("user"); // assuming social login is for normal user role
    setUser(null); // you can fetch user info from /auth/me if needed

    // Redirect to homepage or desired route
    router.replace("/");
  }, [searchParams, router, setIsAuthenticated, setRole, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-backgroundLight px-4">
      <p className="text-gray-700 text-lg md:text-xl">
        Logging you in with Google...
      </p>
    </div>
  );
}
