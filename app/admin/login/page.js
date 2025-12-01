"use client";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatNIC } from "@/utils/formatNIC";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, setUser, setRole } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const [formData, setFormData] = useState({
    nicNumber: "",
    password: "",
    role: "admin",
  });

  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "nicNumber") {
      newValue = formatNIC(value);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setMessage("");

    try {
      const { data } = await api.post("/auth/login", formData);

      if (!data.success) {
        if (data.errors) setErrors(data.errors);
        else if (data.message) setErrors([data.message]);
        setLoading(false);
        return;
      }

      // SUCCESS
      setMessage(data.message);
      setErrors([]);
      setLoading(false);

      // Clear the form
      setFormData({
        nicNumber: "",
        password: "",
      });
      // Optional: redirect to dashboard or homepage
      router.push("/");
console.log(data.user)
      // Update auth state
      setUser(data.user);
      setIsAuthenticated(true);
        setRole("admin");
    } catch (error) {
      console.log("Login Error:", error);

      if (error.response && error.response.data) {
        const resData = error.response.data;
        if (resData.errors) setErrors(resData.errors);
        else if (resData.message) setErrors([resData.message]);
        else setErrors(["Something went wrong. Try again."]);
      } else {
        setErrors(["Something went wrong. Try again."]);
      }

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-backgroundLight px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-md">
        <h1 className="text-4xl font-semibold text-center mb-4 text-primary">
          Admin Dashboard
        </h1>
        <h2 className="text-2xl font-semibold text-center mb-4 text-primary">
          Login to Your Account
        </h2>

        {/* Errors */}
        {/* {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            <ul className="list-disc pl-5 text-sm">
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )} */}

        {/* Success Message */}
        {/* {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
            {message}
          </div>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nicNumber"
            placeholder="NIC Number"
            className="w-full border p-2 rounded-lg"
            value={formData.nicNumber}
            onChange={handleChange}
            maxLength={15} // CNIC max length with dashes
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded-lg"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              <ul className="list-disc pl-5 text-sm">
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg">
              {message}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primaryLight transition"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* <div className="text-center mt-4 text-sm text-[#102851]">
          Don{"'"}t have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign Up
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
