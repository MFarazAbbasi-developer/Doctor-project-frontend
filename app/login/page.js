"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { formatNIC } from "@/utils/formatNIC";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";


export default function Wrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const tokenFromUrl = searchParams.get("token"); // For Google login
  const { isAuthenticated, setIsAuthenticated, setUser, setRole } = useAuth();

  useEffect(() => {
    // If already logged in, redirect
    if (isAuthenticated) router.replace(redirect);

    // Handle Google OAuth token from backend
    if (tokenFromUrl) {
      try {
        // Save token in cookie or local storage if needed
        document.cookie = `token=${tokenFromUrl}; path=/;`;
        // Fetch user info using token
        api.get("/auth/me", {
          headers: { Authorization: `Bearer ${tokenFromUrl}` },
        })
          .then(({ data }) => {
            if (data.success) {
              setUser(data.user);
              setIsAuthenticated(true);
              setRole(data.user.role || "user");
              router.replace(redirect);
            }
          })
          .catch((err) => {
            toast.error("Google login failed.");
            console.error(err);
          });
      } catch (err) {
        toast.error("Google login failed.");
        console.error(err);
      }
    }
  }, [isAuthenticated, router, redirect, tokenFromUrl, setIsAuthenticated, setUser, setRole]);

  const [formData, setFormData] = useState({
    nicNumber: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "nicNumber") value = formatNIC(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);

      if (!data.success) {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err) => toast.error(err));
        } else if (data.message) {
          toast.error(data.message);
        } else {
          toast.error("Login failed. Try again.");
        }
        setLoading(false);
        return;
      }

      setUser(data.user);
      setIsAuthenticated(true);
      setRole(data.user.role || "user");

      setFormData({ nicNumber: "", password: "" });
      router.push(redirect);
    } catch (error) {
      console.log("Login Error:", error);
      if (error.response && error.response.data) {
        const resData = error.response.data;
        if (resData.errors && Array.isArray(resData.errors)) {
          resData.errors.forEach((err) => toast.error(err));
        } else if (resData.message) {
          toast.error(resData.message);
        } else {
          toast.error("Something went wrong. Try again.");
        }
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Login handler
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
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
        <div className="lg:w-[60%] flex justify-center items-center p-8 md:p-16 w-full">
          <div className="w-full max-w-md">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-8 text-center lg:text-left">
              Login to Your Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-gray-700 text-sm">NIC Number</label>
                <input
                  type="text"
                  name="nicNumber"
                  placeholder="XXXXX-XXXXXXX-X"
                  maxLength={15}
                  value={formData.nicNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryLight outline-none"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryLight outline-none"
                />
                <p className="text-right mt-2 text-sm">
                  <a
                    href="/login/forgot-password"
                    className="text-primaryLight font-medium hover:underline"
                  >
                    Forgot Password?
                  </a>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl text-lg font-medium hover:bg-primaryLight transition"
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </form>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-gray-400 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <button
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition"
>
  {/* Inline Google SVG */}
  <svg
    className="w-5 h-5 mr-3"
    viewBox="0 0 533.5 544.3"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M533.5 278.4c0-17.3-1.5-34-4.4-50.3H272v95.1h146.9c-6.4 34.6-25.3 64-54.3 83.7v69.4h87.7c51.3-47.3 80.2-116.8 80.2-198.0z"
      fill="#4285F4"
    />
    <path
      d="M272 544.3c73.5 0 135-24.3 180-66l-87.7-69.4c-24.3 16.3-55.7 26-92.3 26-70.9 0-131-47.9-152.6-112.2H30.8v70.4C75.8 486 168.5 544.3 272 544.3z"
      fill="#34A853"
    />
    <path
      d="M119.4 319.1c-11.2-33.3-11.2-69.2 0-102.5V146.2H30.8c-40.1 78.1-40.1 169.2 0 247.3l88.6-74.4z"
      fill="#FBBC05"
    />
    <path
      d="M272 107.7c38.8-0.6 75.8 14 103.8 41.3l77.9-77.9C407 24.5 345.5 0 272 0 168.5 0 75.8 58.3 30.8 146.2l88.6 70.4C141 155.6 201.1 107.7 272 107.7z"
      fill="#EA4335"
    />
  </svg>
  Continue with Google
</button>


            <p className="text-center text-gray-700 mt-4 text-sm">
              Don{"'"}t have an account?{" "}
              <a href="/signup" className="text-primaryLight font-medium hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
