"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
// import Select from "react-select";
import dynamic from "next/dynamic";
// import React-Select dynamically to prevent SSR hydration issues
const Select = dynamic(() => import("react-select"), { ssr: false });
import { specializations } from "@/data/specializations";
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "0.75rem",
    borderColor: "#000000",
    padding: "0.1rem",
    minHeight: "3rem",
  }),
  placeholder: (provided) => ({ ...provided, color: "#9CA3AF" }),
};
const AddDoctorPage = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "male",
    // Professional Info
    specialization: "",
    experienceYears: "",
    // Education
    educationBackground: [{ degree: "", institution: "", year: "" }],
    // Clinic Info
    street: "",
    consultationFee: { amount: "", currency: "PKR" },
    // Availability
    availability: {
      days: [],
      timeSlots: [{ start: "", end: "" }],
    },
  });
  const specializationOptions = specializations.map((s) => ({
    label: s,
    value: s,
  }));

  /* --------------------------- Handlers --------------------------- */
  // Handle field state changes with formatting
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    let newValue = value;
    // Format Phone Number
    if (name === "phoneNumber") {
      newValue = formatPhoneNumber(value);
    }
    setFormData((p) => ({ ...p, [name]: newValue }));
  };

  // Education handlers
  const handleEduChange = (idx, key, value) => {
    const arr = [...formData.educationBackground];

    // If the field is 'year', allow only numbers and max 4 digits
    if (key === "year") {
      // Remove non-digit characters
      value = value.replace(/\D/g, "");

      // Limit to 4 digits
      if (value.length > 4) value = value.slice(0, 4);
    }

    arr[idx] = { ...arr[idx], [key]: value };
    setFormData((p) => ({ ...p, educationBackground: arr }));
  };

  const canAddEducation = () => {
    const last = formData.educationBackground.at(-1);
    return last.degree && last.institution && last.year;
  };

  const addEducation = () =>
    setFormData((p) => ({
      ...p,
      educationBackground: [
        ...p.educationBackground,
        { degree: "", institution: "", year: "" },
      ],
    }));
  const removeEducation = (idx) => {
    const arr = [...formData.educationBackground];
    arr.splice(idx, 1);
    setFormData((p) => ({ ...p, educationBackground: arr }));
  };

  // Availability handlers
  const canAddTimeSlot = () => {
    const last = formData.availability.timeSlots.at(-1);
    return last.start && last.end;
  };

  const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const toggleDay = (day) => {
    const days = formData.availability.days.includes(day)
      ? formData.availability.days.filter((d) => d !== day)
      : [...formData.availability.days, day];
    setFormData((p) => ({ ...p, availability: { ...p.availability, days } }));
  };

  const handleTimeSlotChange = (idx, key, val) => {
    const arr = [...formData.availability.timeSlots];
    arr[idx] = { ...arr[idx], [key]: val };
    setFormData((p) => ({
      ...p,
      availability: { ...p.availability, timeSlots: arr },
    }));
  };
  const addTimeSlot = () =>
    setFormData((p) => ({
      ...p,
      availability: {
        ...p.availability,
        timeSlots: [...p.availability.timeSlots, { start: "", end: "" }],
      },
    }));
  const removeTimeSlot = (idx) => {
    const arr = [...formData.availability.timeSlots];
    arr.splice(idx, 1);
    setFormData((p) => ({
      ...p,
      availability: { ...p.availability, timeSlots: arr },
    }));
  };

  // Fee handler
  const handleFeeChange = (key, value) => {
    setFormData((p) => ({
      ...p,
      consultationFee: { ...p.consultationFee, [key]: value },
    }));
  };

  /* --------------------------- Submit --------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();

      // simple top-level fields
      const simpleFields = [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "gender",
        "specialization",
        "experienceYears",
        "street",
      ];
      simpleFields.forEach((key) => payload.append(key, formData[key]));

      // Education Background
      formData.educationBackground.forEach((edu, i) => {
        payload.append(`educationBackground[${i}][degree]`, edu.degree);
        payload.append(
          `educationBackground[${i}][institution]`,
          edu.institution
        );
        payload.append(`educationBackground[${i}][year]`, edu.year);
      });

      // Availability
      formData.availability.days.forEach((day, i) => {
        payload.append(`availability[days][${i}]`, day);
      });
      formData.availability.timeSlots.forEach((ts, i) => {
        payload.append(`availability[timeSlots][${i}][start]`, ts.start);
        payload.append(`availability[timeSlots][${i}][end]`, ts.end);
      });

      // Fee
      payload.append(
        "consultationFee[amount]",
        formData.consultationFee.amount
      );
      payload.append(
        "consultationFee[currency]",
        formData.consultationFee.currency
      );

      const { data } = await api.post("/admin/doctors/add", payload);

      if (data.success) {
        toast.success("Doctor added successfully!");
        router.push("/admin/doctors");
        // router.push("/admin/doctors/add");
      } else {
        toast.error(data.message || "Failed to add doctor");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add doctor.");
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------- Render --------------------------- */

  return (
    <div className="px-6 lg:px-20 py-10 max-w-4xl mx-auto">
      <button
        type="button"
        onClick={() => router.push("/admin/doctors")}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Doctors
      </button>

      <h1 className="text-4xl font-extrabold text-primary mb-10 text-center">
        Add Doctor
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* ================= PERSONAL INFO ================= */}
        <section className="bg-white shadow-md rounded-xl p-6 space-y-6 border">
          <h2 className="text-xl font-semibold text-primary">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Input
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              handleChange={handleChange}
            />
            <Input
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              handleChange={handleChange}
            />
            <div className="relative">
              <label className="floating-label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* ================= PROFESSIONAL INFO ================= */}
        <section className="bg-white shadow-md rounded-xl p-6 space-y-6 border">
          <h2 className="text-xl font-semibold text-primary">
            Professional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                value={
                  specializationOptions.find(
                    (opt) => opt.value === formData?.specialization
                  )
                }
                onChange={(val) =>
                  setFormData((p) => ({ ...p, specialization: val?.value }))
                }
                options={specializationOptions}
                styles={customSelectStyles}
                placeholder="Select Specialization"
                isSearchable
                isClearable
                required
              />
            </div>
            <Input
              name="experienceYears"
              type="number"
              label="Years of Experience"
              value={formData.experienceYears}
              handleChange={handleChange}
            />
          </div>

          {/* Education */}
          <div>
            <h3 className="font-semibold mb-2">Education Background</h3>
            {formData.educationBackground.map((edu, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  label="Degree"
                  value={edu.degree}
                  handleChange={(e) =>
                    handleEduChange(i, "degree", e.target.value)
                  }
                />
                <Input
                  label="Institution"
                  value={edu.institution}
                  handleChange={(e) =>
                    handleEduChange(i, "institution", e.target.value)
                  }
                />
                <Input
                  label="Year"
                  value={edu.year}
                  handleChange={(e) =>
                    handleEduChange(i, "year", e.target.value)
                  }
                />
                {formData.educationBackground.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(i)}
                    className="px-3 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              disabled={!canAddEducation()}
              className={`px-3 py-1 rounded text-white ${
                canAddEducation()
                  ? "bg-primary"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add Education
            </button>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-semibold mb-2">Availability</h3>
            <div className="flex gap-2 flex-wrap mb-3">
              {WEEK_DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  className={`px-3 py-1 rounded ${
                    formData.availability.days.includes(d)
                      ? "bg-primary text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            {formData.availability.timeSlots.map((ts, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="time"
                  value={ts.start}
                  onChange={(e) =>
                    handleTimeSlotChange(i, "start", e.target.value)
                  }
                  className="input-field"
                />
                <input
                  type="time"
                  value={ts.end}
                  onChange={(e) =>
                    handleTimeSlotChange(i, "end", e.target.value)
                  }
                  className="input-field"
                />
                {formData.availability.timeSlots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(i)}
                    className="px-3 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTimeSlot}
              disabled={!canAddTimeSlot()}
              className={`px-3 py-1 rounded text-white ${
                canAddTimeSlot()
                  ? "bg-primary"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add Time Slot
            </button>
          </div>
        </section>

        {/* ================= CLINIC INFO ================= */}
        <section className="bg-white shadow-md rounded-xl p-6 space-y-6 border">
          <h2 className="text-xl font-semibold text-primary">
            Clinic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="street"
              label="Street"
              value={formData.street}
              handleChange={handleChange}
            />
            <Input
              name="amount"
              type="number"
              label="Fee Amount"
              value={formData.consultationFee.amount}
              handleChange={(e) => handleFeeChange("amount", e.target.value)}
              required
            />
          </div>
        </section>

        {/* ================= SUBMIT ================= */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primaryLight transition shadow-md"
        >
          {submitting ? "Adding..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
};

export default AddDoctorPage;

/* ========== Reusable Components ========== */

const Input = ({
  label,
  name,
  value,
  handleChange,
  type = "text",
  required,
}) => (
  <div className="relative">
    <label className="floating-label">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      required={required}
      className="input-field"
    />
  </div>
);
