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
    if (!searchParams) return; // <-- ensure it exists

    const token = searchParams.get("token");
    if (!token) {
      toast.error("Google login failed. No token received.");
      router.replace("/login");
      return;
    }

    // browser-only
    if (typeof document !== "undefined") {
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    }

    setIsAuthenticated(true);
    setRole("user");
    setUser(null);

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
