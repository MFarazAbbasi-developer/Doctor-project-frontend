"use client";

import { Suspense, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatNIC } from "@/utils/formatNIC";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { specializations } from "@/data/specializations"; // <-- Your specialization list
import { cities } from "@/data/cities"; // <-- Your city list
// import Select from "react-select";
import dynamic from "next/dynamic";
// import React-Select dynamically to prevent SSR hydration issues
const Select = dynamic(() => import("react-select"), { ssr: false });

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "0.75rem",
    borderColor: "#E5E7EB",
    padding: "0.1rem",
    minHeight: "3rem",
  }),
  placeholder: (provided) => ({ ...provided, color: "#9CA3AF" }),
};

export default function Wrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Signup />
    </Suspense>
  );
}

function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const tokenFromUrl = searchParams.get("token");
  const { isAuthenticated, setIsAuthenticated, setUser, setRole } = useAuth();
  const [isDoctor, setIsDoctor] = useState(searchParams.get("role") === "doctor");

  useEffect(() => {
    if (isAuthenticated) router.replace(redirect);

    if (tokenFromUrl) {
      api
        .get("/auth/me", {
          headers: { Authorization: `Bearer ${tokenFromUrl}` },
        })
        .then(({ data }) => {
          if (data.success) {
            document.cookie = `token=${tokenFromUrl}; path=/;`;
            setUser(data.user);
            setIsAuthenticated(true);
            setRole(data.user.role || "user");
            router.replace(redirect);
          }
        })
        .catch(() => toast.error("Google login failed."));
    }
  }, []);

  const [formData, setFormData] = useState({
    // common
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    nicNumber: "",
    gender: "",

    // doctor-only
    specialization: "",
    city: "",
    fee: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "nicNumber") value = formatNIC(value);
    if (name === "phoneNumber") value = formatPhoneNumber(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload, endpoint;

      if (isDoctor) {
        payload = {
          name: { firstName: formData.firstName, lastName: formData.lastName },
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          specialization: formData.specialization,
          clinicAddress: { city: formData.city },
          consultationFee: { amount: Number(formData.fee), currency: "PKR" },
        };
        endpoint = "/doctor/register";
      } else {
        payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          nicNumber: formData.nicNumber,
          //   gender: formData.gender,
        };
        endpoint = "/auth/register";
      }

      const { data } = await api.post(endpoint, payload);

      if (!data.success) {
        if (data.errors) data.errors.forEach((err) => toast.error(err));
        else toast.error(data.message);
        setLoading(false);
        return;
      }

      if (!isDoctor) {
        toast.success("Signup successful!");
        setUser(data.user);
        setIsAuthenticated(true);
        setRole(isDoctor ? "doctor" : "user");
        router.push("/");
      }
      else{
        toast.success("Doctor registration successful! Awaiting admin approval.");
        
      }
    } catch (error) {
      const res = error.response?.data;
      if (res?.errors) res.errors.forEach((err) => toast.error(err));
      else toast.error(res?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const specializationOptions = specializations.map((s) => ({
    label: s,
    value: s,
  }));
  const cityOptions = cities.map((c) => ({ label: c, value: c }));
  const genderOptions = ["male", "female", "other"].map((g) => ({
    label: g,
    value: g,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* LEFT */}
        <div className="lg:w-[40%] bg-primaryLight text-white p-10 hidden lg:flex flex-col justify-between relative">
          <h1 className="text-4xl font-bold">
            Hospital <span className="font-light">Logo</span>
          </h1>
          <img
            src="/2-doctors.png"
            className="absolute bottom-0 w-full object-contain drop-shadow-xl"
          />
        </div>

        {/* RIGHT */}
        <div className="lg:w-[60%] flex justify-center items-center p-8 md:p-16">
          <div className="w-full max-w-md">
            {/* TOGGLE */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-1 rounded-xl flex">
                <button
                  type="button"
                  onClick={() => setIsDoctor(false)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    !isDoctor ? "bg-primary text-white" : "text-gray-700"
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setIsDoctor(true)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    isDoctor ? "bg-primary text-white" : "text-gray-700"
                  }`}
                >
                  Doctor
                </button>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-8 text-center">
              {isDoctor ? "Doctor Registration" : "Create Your Account"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  handleChange={handleChange}
                  required
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  handleChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  value={formData.email}
                  handleChange={handleChange}
                  required
                />

                <Input
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  handleChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!isDoctor ? (
                  <Input
                    name="nicNumber"
                    label="NIC Number"
                    value={formData.nicNumber}
                    handleChange={handleChange}
                    required
                  />
                ) : (
                  <Input
                    name="fee"
                    type="number"
                    label="Consultation Fee"
                    value={formData.fee}
                    handleChange={handleChange}
                    required
                  />
                )}

                <Input
                  name="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  handleChange={handleChange}
                  required
                />
              </div>

              {isDoctor && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectComponent
                      label="Gender"
                      value={formData.gender}
                      onChange={(val) =>
                        setFormData({ ...formData, gender: val })
                      }
                      options={genderOptions}
                      isClearable
                      placeholder="Select Gender"
                    />
                    <SelectComponent
                      label="City"
                      value={formData.city}
                      onChange={(val) =>
                        setFormData({ ...formData, city: val })
                      }
                      options={cityOptions}
                      isClearable
                      placeholder="Select City"
                    />
                  </div>
                  <SelectComponent
                    label="Specialization"
                    value={formData.specialization}
                    onChange={(val) =>
                      setFormData({ ...formData, specialization: val })
                    }
                    options={specializationOptions}
                    isClearable
                    placeholder="Select Specialization"
                  />
                </>
              )}

              <div className="flex gap-3 items-center">
                <input type="checkbox" className="w-4 h-4" required />
                <p className="text-sm text-gray-700">
                  I accept all{" "}
                  <span className="text-primaryLight">
                    terms and conditions
                  </span>
                </p>
              </div>

              <button className="w-full bg-primary text-white py-3 rounded-xl text-lg font-medium">
                {loading ? "Signing Up..." : "Sign up"}
              </button>

              {!isDoctor && (
                <>
                  <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-2 text-gray-400 text-sm">OR</span>
                    <hr className="flex-grow border-gray-300" />
                  </div>
                  {/* Google login button */}{" "}
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition"
                  >
                    {" "}
                    <svg
                      className="w-5 h-5 mr-3"
                      viewBox="0 0 533.5 544.3"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {" "}
                      <path
                        d="M533.5 278.4c0-17.3-1.5-34-4.4-50.3H272v95.1h146.9c-6.4 34.6-25.3 64-54.3 83.7v69.4h87.7c51.3-47.3 80.2-116.8 80.2-198.0z"
                        fill="#4285F4"
                      />{" "}
                      <path
                        d="M272 544.3c73.5 0 135-24.3 180-66l-87.7-69.4c-24.3 16.3-55.7 26-92.3 26-70.9 0-131-47.9-152.6-112.2H30.8v70.4C75.8 486 168.5 544.3 272 544.3z"
                        fill="#34A853"
                      />{" "}
                      <path
                        d="M119.4 319.1c-11.2-33.3-11.2-69.2 0-102.5V146.2H30.8c-40.1 78.1-40.1 169.2 0 247.3l88.6-74.4z"
                        fill="#FBBC05"
                      />{" "}
                      <path
                        d="M272 107.7c38.8-0.6 75.8 14 103.8 41.3l77.9-77.9C407 24.5 345.5 0 272 0 168.5 0 75.8 58.3 30.8 146.2l88.6 70.4C141 155.6 201.1 107.7 272 107.7z"
                        fill="#EA4335"
                      />{" "}
                    </svg>{" "}
                    Continue with Google{" "}
                  </button>
                  <p className="text-center text-gray-700 mt-4 text-sm">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-primaryLight font-medium hover:underline"
                    >
                      Log in
                    </a>
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------
// Reusable Components
// ------------------------
function Input({ name, label, value, handleChange, required, type = "text" }) {
  return (
    <div>
      <label className="text-gray-700 text-sm">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={label}
        onChange={handleChange}
        required={required}
        className="w-full p-3 mt-1 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primaryLight outline-none"
      />
    </div>
  );
}

function SelectComponent({
  label,
  value,
  onChange,
  options,
  placeholder,
  isClearable,
}) {
  return (
    <div>
      <label className="text-gray-700 text-sm">{label}</label>
      <Select
        value={options.find((opt) => opt.value === value) || null}
        onChange={(val) => onChange(val?.value || "")}
        options={options}
        styles={customSelectStyles}
        placeholder={placeholder}
        isSearchable
        isClearable={isClearable}
      />
    </div>
  );
}
