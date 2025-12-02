"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { ArrowLeft, Edit } from "lucide-react";
import { formatNIC } from "@/utils/formatNIC";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

const AddDoctorPage = () => {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    nicNumber: "",
    gender: "male",
    profileImage: null,

    // Professional Info
    description: "",
    bio: "",
    specialization: "",
    experienceYears: "",
    languages: [""],
    services: [""],
    tags: [""],

    // Education & Certifications
    educationBackground: [
      { degree: "", institution: "", year: "" }
    ],
    certifications: [
      { title: "", organization: "", year: "" }
    ],

    // Clinic Info
    street: "",
    city: "",
    zipCode: "",
    province: "",
    mapLink: "",
    consultationFee: { amount: "", currency: "PKR" },

    // Availability
    availability: {
      days: [],
      timeSlots: [
        { start: "", end: "" }
      ]
    },
  });

  /* --------------------------- Handlers --------------------------- */

// Handle field state changes with formatting
const handleChange = (e) => {
  const { name, value, files, type } = e.target;
  let newValue = value;

  // Format NIC and Phone Number
  if (name === "nicNumber") {
    newValue = formatNIC(value);
  }
  if (name === "phoneNumber") {
    newValue = formatPhoneNumber(value);
  }

  if (type === "file") {
    setFormData((p) => ({ ...p, profileImage: files[0] }));
    setImagePreview(URL.createObjectURL(files[0]));
  } else {
    setFormData((p) => ({ ...p, [name]: newValue }));
  }
};


  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleAddArrayField = (field) => {
    const last = formData[field][formData[field].length - 1];
    if (last === "") {
      toast.error("Please fill the last field before adding a new one.");
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleRemoveArrayField = (field, index) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  // Education / Certification handlers
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

  const addEducation = () =>
    setFormData((p) => ({
      ...p,
      educationBackground: [...p.educationBackground, { degree: "", institution: "", year: "" }]
    }));
  const removeEducation = (idx) => {
    const arr = [...formData.educationBackground];
    arr.splice(idx, 1);
    setFormData((p) => ({ ...p, educationBackground: arr }));
  };

const handleCertChange = (idx, key, value) => {
  const arr = [...formData.certifications];

  // If the field is 'year', allow only numbers and max 4 digits
  if (key === "year") {
    // Remove non-digit characters
    value = value.replace(/\D/g, "");

    // Limit to 4 digits
    if (value.length > 4) value = value.slice(0, 4);
  }

  arr[idx] = { ...arr[idx], [key]: value };
  setFormData((p) => ({ ...p, certifications: arr }));
};

  const addCertification = () =>
    setFormData((p) => ({
      ...p,
      certifications: [...p.certifications, { title: "", organization: "", year: "" }]
    }));
  const removeCertification = (idx) => {
    const arr = [...formData.certifications];
    arr.splice(idx, 1);
    setFormData((p) => ({ ...p, certifications: arr }));
  };

  // Availability handlers
  const WEEK_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const toggleDay = (day) => {
    const days = formData.availability.days.includes(day)
      ? formData.availability.days.filter((d) => d !== day)
      : [...formData.availability.days, day];
    setFormData((p) => ({ ...p, availability: { ...p.availability, days } }));
  };

  const handleTimeSlotChange = (idx, key, val) => {
    const arr = [...formData.availability.timeSlots];
    arr[idx] = { ...arr[idx], [key]: val };
    setFormData((p) => ({ ...p, availability: { ...p.availability, timeSlots: arr } }));
  };
  const addTimeSlot = () => setFormData((p) => ({
    ...p,
    availability: { ...p.availability, timeSlots: [...p.availability.timeSlots, { start: "", end: "" }] }
  }));
  const removeTimeSlot = (idx) => {
    const arr = [...formData.availability.timeSlots]; arr.splice(idx, 1);
    setFormData((p) => ({ ...p, availability: { ...p.availability, timeSlots: arr } }));
  };

  // Fee handler
  const handleFeeChange = (key, value) => {
    setFormData((p) => ({ ...p, consultationFee: { ...p.consultationFee, [key]: value } }));
  };

  /* --------------------------- Submit --------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();

      // simple top-level fields
      const simpleFields = [
        "firstName","lastName","email","password","phoneNumber","nicNumber","gender",
        "description", "bio","specialization","experienceYears","street","city","zipCode","province","mapLink"
      ];
      simpleFields.forEach((key) => payload.append(key, formData[key]));

      // arrays of strings
      ["languages","services","tags"].forEach((arrKey) => {
        formData[arrKey].filter(v => v && v.trim() !== "").forEach(v => payload.append(arrKey, v));
      });

      // nested arrays / objects
    //   payload.append("educationBackground", JSON.stringify(formData.educationBackground));
    //   payload.append("certifications", JSON.stringify(formData.certifications));
    //   payload.append("availability", JSON.stringify(formData.availability));
    //   payload.append("consultationFee", JSON.stringify(formData.consultationFee));
    // Education Background
formData.educationBackground.forEach((edu, i) => {
  payload.append(`educationBackground[${i}][degree]`, edu.degree);
  payload.append(`educationBackground[${i}][institution]`, edu.institution);
  payload.append(`educationBackground[${i}][year]`, edu.year);
});

// Certifications
formData.certifications.forEach((c, i) => {
  payload.append(`certifications[${i}][title]`, c.title);
  payload.append(`certifications[${i}][organization]`, c.organization);
  payload.append(`certifications[${i}][year]`, c.year);
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
    payload.append("consultationFee[amount]", formData.consultationFee.amount);
payload.append("consultationFee[currency]", formData.consultationFee.currency);

      // profile image
      if (formData.profileImage) payload.append("profileImage", formData.profileImage);

      const { data } = await api.post("/auth/doctors/add", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Doctor added successfully!");
        // router.push("/admin/doctors");
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
        onClick={() => router.push("/signup")}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-5 h-5" /> Sign Up as Patient
      </button>

      <h1 className="text-4xl font-extrabold text-primary mb-10 text-center">
        Doctor Registration
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* ================= Profile Image ================= */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-36 h-36 rounded-full object-cover border-4 border-primaryLight shadow-md"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-primaryLight shadow-md">
                N/A
              </div>
            )}

            <label className="absolute bottom-1 right-1 bg-primary p-2 rounded-full cursor-pointer hover:bg-primaryLight transition shadow-md">
              <Edit className="w-5 h-5 text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                name="profileImage"
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        {/* ================= PERSONAL INFO ================= */}
        <section className="bg-white shadow-md rounded-xl p-6 space-y-6 border">
          <h2 className="text-xl font-semibold text-primary">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="firstName" label="First Name" value={formData.firstName} handleChange={handleChange} required />
            <Input name="lastName" label="Last Name" value={formData.lastName} handleChange={handleChange} required />
            <Input name="email" type="email" label="Email" value={formData.email} handleChange={handleChange} required />
            <Input name="phoneNumber" label="Phone Number" value={formData.phoneNumber} handleChange={handleChange} required />
            <Input name="nicNumber" label="NIC Number" value={formData.nicNumber} handleChange={handleChange} required />
            <div className="relative">
              <label className="floating-label">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input name="password" type="password" label="Password" value={formData.password} handleChange={handleChange} required />
          </div>
        </section>

        {/* ================= PROFESSIONAL INFO ================= */}
        <section className="bg-white shadow-md rounded-xl p-6 space-y-6 border">
          <h2 className="text-xl font-semibold text-primary">Professional Information</h2>
          <Textarea label="Bio" name="bio" value={formData.bio} handleChange={handleChange} />
          <Textarea label="Description" name="description" value={formData.description} handleChange={handleChange} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="specialization" label="Specialization" value={formData.specialization} handleChange={handleChange} required />
            <Input name="experienceYears" type="number" label="Years of Experience" value={formData.experienceYears} handleChange={handleChange} required />
          </div>

          <ArrayInput label="Languages" field="languages" values={formData.languages} handleChange={handleArrayChange} handleAdd={handleAddArrayField} handleRemove={handleRemoveArrayField} />
          <ArrayInput label="Services" field="services" values={formData.services} handleChange={handleArrayChange} handleAdd={handleAddArrayField} handleRemove={handleRemoveArrayField} />
          <ArrayInput label="Tags" field="tags" values={formData.tags} handleChange={handleArrayChange} handleAdd={handleAddArrayField} handleRemove={handleRemoveArrayField} />

          {/* Education */}
          <div>
            <h3 className="font-semibold mb-2">Education Background</h3>
            {formData.educationBackground.map((edu, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input label="Degree" value={edu.degree} handleChange={(e) => handleEduChange(i, "degree", e.target.value)} />
                <Input label="Institution" value={edu.institution} handleChange={(e) => handleEduChange(i, "institution", e.target.value)} />
                <Input label="Year" value={edu.year} handleChange={(e) => handleEduChange(i, "year", e.target.value)} />
                <button type="button" onClick={() => removeEducation(i)} className="px-3 bg-red-500 text-white rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addEducation} className="px-3 py-1 bg-primary text-white rounded">Add more</button>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="font-semibold mb-2">Certifications</h3>
            {formData.certifications.map((c, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input label="Title" value={c.title} handleChange={(e) => handleCertChange(i, "title", e.target.value)} />
                <Input label="Organization" value={c.organization} handleChange={(e) => handleCertChange(i, "organization", e.target.value)} />
                <Input label="Year" value={c.year} handleChange={(e) => handleCertChange(i, "year", e.target.value)} />
                <button type="button" onClick={() => removeCertification(i)} className="px-3 bg-red-500 text-white rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addCertification} className="px-3 py-1 bg-primary text-white rounded">Add more</button>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-semibold mb-2">Availability</h3>
            <div className="flex gap-2 flex-wrap mb-3">
              {WEEK_DAYS.map((d) => (
                <button key={d} type="button" onClick={() => toggleDay(d)}
                  className={`px-3 py-1 rounded ${formData.availability.days.includes(d) ? "bg-primary text-white" : "bg-gray-100"}`}>
                  {d}
                </button>
              ))}
            </div>
            {formData.availability.timeSlots.map((ts, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="time" value={ts.start} onChange={(e) => handleTimeSlotChange(i, "start", e.target.value)} className="input-field" />
                <input type="time" value={ts.end} onChange={(e) => handleTimeSlotChange(i, "end", e.target.value)} className="input-field" />
                <button type="button" onClick={() => removeTimeSlot(i)} className="px-3 bg-red-500 text-white rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addTimeSlot} className="px-3 py-1 bg-primary text-white rounded">Add more</button>
          </div>

        </section>

        {/* ================= CLINIC INFO ================= */}
        <section className="bg-white shadow-md rounded-xl p-6 space-y-6 border">
          <h2 className="text-xl font-semibold text-primary">Clinic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="street" label="Street" value={formData.street} handleChange={handleChange} />
            <Input name="city" label="City" value={formData.city} handleChange={handleChange} required />
            <Input name="zipCode" label="ZIP Code" value={formData.zipCode} handleChange={handleChange} required />
            <Input name="province" label="Province" value={formData.province} handleChange={handleChange} />
            <Input name="mapLink" label="Map Link" value={formData.mapLink} handleChange={handleChange} />
            <div className="flex gap-2">
              <Input name="amount" type="number" label="Fee Amount" value={formData.consultationFee.amount} handleChange={(e) => handleFeeChange("amount", e.target.value)} required />
              <select value={formData.consultationFee.currency} onChange={(e) => handleFeeChange("currency", e.target.value)} className="input-field w-36">
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </section>

        {/* ================= SUBMIT ================= */}
        <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primaryLight transition shadow-md">
          {submitting ? "Adding..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
};

export default AddDoctorPage;

/* ========== Reusable Components ========== */

const Input = ({ label, name, value, handleChange, type = "text", required }) => (
  <div className="relative">
    <label className="floating-label">{label}</label>
    <input type={type} name={name} value={value} onChange={handleChange} required={required} className="input-field" />
  </div>
);

const Textarea = ({ label, name, value, handleChange }) => (
  <div className="relative">
    <label className="floating-label">{label}</label>
    <textarea name={name} value={value} onChange={handleChange} className="input-field min-h-[120px]" />
  </div>
);

const ArrayInput = ({ label, field, values, handleChange, handleAdd, handleRemove }) => (
  <div>
    <label className="font-semibold block mb-2 text-gray-700">{label}</label>
    {values.map((v, i) => (
      <div key={i} className="flex gap-2 mb-2">
        <input type="text" value={v} onChange={(e) => handleChange(field, i, e.target.value)} className="input-field flex-1" />
        <button type="button" onClick={() => handleRemove(field, i)} className="px-3 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
      </div>
    ))}
    <button type="button" onClick={() => handleAdd(field)} className="mt-2 px-4 py-1 bg-primary text-white rounded-lg hover:bg-primaryLight transition">Add more</button>
    {/* {label.slice(0, -1)} */}
  </div>
);
