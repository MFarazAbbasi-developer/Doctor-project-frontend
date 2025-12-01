"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { ArrowLeft, Edit } from "lucide-react";
import { formatNIC } from "@/utils/formatNIC";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { getProfileImage } from "@/utils/getProfileImage";

const WEEK_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const EditDoctorPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const doctorId = id;

  const [loading, setLoading] = useState(true);
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
    educationBackground: [{ degree: "", institution: "", year: "" }],
    certifications: [{ title: "", organization: "", year: "" }],

    // Clinic Info
    street: "",
    city: "",
    zipCode: "",
    province: "",
    mapLink: "",
    consultationFee: { amount: "", currency: "PKR" },

    // Availability
    availability: { days: [], timeSlots: [{ start: "", end: "" }] },

    // Status
    isBlocked: false,
    isAccountVerified: false,
  });

  /* ---------------------- Fetch Doctor ---------------------- */
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/admin/doctors/${doctorId}`);
        if (data.success) {
          const d = data.doctor;
          setFormData({
            firstName: d.name.firstName,
            lastName: d.name.lastName,
            email: d.email,
            password: "",
            phoneNumber: d.phoneNumber,
            nicNumber: d.nicNumber,
            gender: d.gender,
            profileImage: null,
            description: d.description || "",
            bio: d.bio || "",
            specialization: d.specialization || "",
            experienceYears: d.experienceYears || "",
            languages: d.languages.length ? d.languages : [""],
            services: d.services.length ? d.services : [""],
            tags: d.tags.length ? d.tags : [""],
            educationBackground: d.educationBackground.length ? d.educationBackground : [{ degree: "", institution: "", year: "" }],
            certifications: d.certifications.length ? d.certifications : [{ title: "", organization: "", year: "" }],
            street: d.clinicAddress.street || "",
            city: d.clinicAddress.city || "",
            zipCode: d.clinicAddress.zipCode || "",
            province: d.clinicAddress.province || "",
            mapLink: d.clinicAddress.mapLink || "",
            consultationFee: d.consultationFee || { amount: "", currency: "PKR" },
            availability: d.availability || { days: [], timeSlots: [{ start: "", end: "" }] },
            isBlocked: d.isBlocked,
            isAccountVerified: d.isAccountVerified,
          });
          if (d.profileImage) setImagePreview(d.profileImage);
        }
      } catch (err) {
        toast.error("Failed to fetch doctor data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  /* ---------------------- Handlers ---------------------- */
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    let newValue = value;

    if (name === "nicNumber") newValue = formatNIC(value);
    if (name === "phoneNumber") newValue = formatPhoneNumber(value);

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
    setFormData((p) => ({ ...p, [field]: updated }));
  };

  const handleAddArrayField = (field) => {
    const last = formData[field][formData[field].length - 1];
    if (last === "") return toast.error("Fill last field before adding.");
    setFormData((p) => ({ ...p, [field]: [...p[field], ""] }));
  };

  const handleRemoveArrayField = (field, index) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData((p) => ({ ...p, [field]: updated }));
  };

  const handleEduChange = (idx, key, value) => {
    if (key === "year") value = value.replace(/\D/g, "").slice(0, 4);
    const arr = [...formData.educationBackground];
    arr[idx] = { ...arr[idx], [key]: value };
    setFormData((p) => ({ ...p, educationBackground: arr }));
  };
  const addEducation = () => setFormData((p) => ({
    ...p,
    educationBackground: [...p.educationBackground, { degree: "", institution: "", year: "" }]
  }));
  const removeEducation = (idx) => {
    const arr = [...formData.educationBackground];
    arr.splice(idx, 1);
    setFormData((p) => ({ ...p, educationBackground: arr }));
  };

  const handleCertChange = (idx, key, value) => {
    if (key === "year") value = value.replace(/\D/g, "").slice(0, 4);
    const arr = [...formData.certifications];
    arr[idx] = { ...arr[idx], [key]: value };
    setFormData((p) => ({ ...p, certifications: arr }));
  };
  const addCertification = () => setFormData((p) => ({
    ...p,
    certifications: [...p.certifications, { title: "", organization: "", year: "" }]
  }));
  const removeCertification = (idx) => {
    const arr = [...formData.certifications];
    arr.splice(idx, 1);
    setFormData((p) => ({ ...p, certifications: arr }));
  };

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

  const handleFeeChange = (key, value) => {
    setFormData((p) => ({ ...p, consultationFee: { ...p.consultationFee, [key]: value } }));
  };

  /* ---------------------- Submit ---------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();

      // simple fields
      const simpleFields = [
        "firstName","lastName","email","password","phoneNumber","nicNumber","gender",
        "description", "bio","specialization","experienceYears","street","city","zipCode","province", "mapLink",
        "isBlocked","isAccountVerified"
      ];
      simpleFields.forEach(k => payload.append(k, formData[k]));

      // arrays of strings
      ["languages","services","tags"].forEach(arrKey => {
        formData[arrKey].filter(v => v && v.trim() !== "").forEach(v => payload.append(arrKey, v));
      });

      // education & certifications
      formData.educationBackground.forEach((edu, i) => {
        payload.append(`educationBackground[${i}][degree]`, edu.degree);
        payload.append(`educationBackground[${i}][institution]`, edu.institution);
        payload.append(`educationBackground[${i}][year]`, edu.year);
      });
      formData.certifications.forEach((c, i) => {
        payload.append(`certifications[${i}][title]`, c.title);
        payload.append(`certifications[${i}][organization]`, c.organization);
        payload.append(`certifications[${i}][year]`, c.year);
      });

      // availability
      formData.availability.days.forEach((d,i) => payload.append(`availability[days][${i}]`, d));
      formData.availability.timeSlots.forEach((ts,i) => {
        payload.append(`availability[timeSlots][${i}][start]`, ts.start);
        payload.append(`availability[timeSlots][${i}][end]`, ts.end);
      });

      // fee
      payload.append("consultationFee[amount]", formData.consultationFee.amount);
      payload.append("consultationFee[currency]", formData.consultationFee.currency);

      // profile image
      if (formData.profileImage) payload.append("profileImage", formData.profileImage);

      const { data } = await api.put(`/admin/doctors/edit/${doctorId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Doctor updated successfully!");
        router.push(`/doctor/${doctorId}`);
      } else toast.error(data.message || "Failed to update doctor.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update doctor.");
    } finally { setSubmitting(false); }
  };

  /* ---------------------- Render ---------------------- */
  if (loading) return <p className="text-center text-gray-500 mt-10">Loading doctor data...</p>;

  return (
    <div className="px-6 lg:px-20 py-10 max-w-4xl mx-auto">
      <button type="button" onClick={() => router.push("/admin/doctors")}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition">
        <ArrowLeft className="w-5 h-5" /> Back to Doctors
      </button>

      <h1 className="text-4xl font-extrabold text-primary mb-10 text-center">Edit Doctor</h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* ================= Profile Image ================= */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="w-36 h-36 rounded-full object-cover border-4 border-primaryLight shadow-md" 
  onError={(e) => {
    e.currentTarget.src = "/default-image.avif"; // fallback image
  }}/>

            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-primaryLight shadow-md">N/A</div>
            )}
            <label className="absolute bottom-1 right-1 bg-primary p-2 rounded-full cursor-pointer hover:bg-primaryLight transition shadow-md">
              <Edit className="w-5 h-5 text-white" />
              <input type="file" accept="image/*" className="hidden" name="profileImage" onChange={handleChange}/>
            </label>
          </div>
        </div>

        {/* ================= Personal Info ================= */}
        <section className="bg-white shadow-md rounded-xl p-6 space-y-6 border">
          <h2 className="text-xl font-semibold text-primary">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="firstName" label="First Name" value={formData.firstName} handleChange={handleChange} required />
            <Input name="lastName" label="Last Name" value={formData.lastName} handleChange={handleChange} required />
            <Input name="email" label="Email" value={formData.email} handleChange={handleChange} required />
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
            <Input name="password" type="password" label="Password (leave blank to keep same)" value={formData.password} handleChange={handleChange} />
          </div>
        </section>

        {/* ================= Professional Info ================= */}
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
            {formData.educationBackground.map((edu,i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input label="Degree" value={edu.degree} handleChange={(e)=>handleEduChange(i,"degree",e.target.value)} />
                <Input label="Institution" value={edu.institution} handleChange={(e)=>handleEduChange(i,"institution",e.target.value)} />
                <Input label="Year" value={edu.year} handleChange={(e)=>handleEduChange(i,"year",e.target.value)} />
                <button type="button" onClick={()=>removeEducation(i)} className="px-3 bg-red-500 text-white rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addEducation} className="px-3 py-1 bg-primary text-white rounded">Add Education</button>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="font-semibold mb-2">Certifications</h3>
            {formData.certifications.map((c,i)=>(
              <div key={i} className="flex gap-2 mb-2">
                <Input label="Title" value={c.title} handleChange={(e)=>handleCertChange(i,"title",e.target.value)} />
                <Input label="Organization" value={c.organization} handleChange={(e)=>handleCertChange(i,"organization",e.target.value)} />
                <Input label="Year" value={c.year} handleChange={(e)=>handleCertChange(i,"year",e.target.value)} />
                <button type="button" onClick={()=>removeCertification(i)} className="px-3 bg-red-500 text-white rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addCertification} className="px-3 py-1 bg-primary text-white rounded">Add Certification</button>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-semibold mb-2">Availability</h3>
            <div className="flex gap-2 flex-wrap mb-3">
              {WEEK_DAYS.map(d => (
                <button key={d} type="button" onClick={()=>toggleDay(d)}
                  className={`px-3 py-1 rounded ${formData.availability.days.includes(d) ? "bg-primary text-white" : "bg-gray-100"}`}>
                  {d}
                </button>
              ))}
            </div>
            {formData.availability.timeSlots.map((ts,i)=>(
              <div key={i} className="flex gap-2 mb-2">
                <input type="time" value={ts.start} onChange={(e)=>handleTimeSlotChange(i,"start",e.target.value)} className="input-field"/>
                <input type="time" value={ts.end} onChange={(e)=>handleTimeSlotChange(i,"end",e.target.value)} className="input-field"/>
                <button type="button" onClick={()=>removeTimeSlot(i)} className="px-3 bg-red-500 text-white rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addTimeSlot} className="px-3 py-1 bg-primary text-white rounded">Add Time Slot</button>
          </div>
        </section>

        {/* ================= Clinic Info ================= */}
        <section className="bg-white shadow-md rounded-xl p-6 space-y-6 border">
          <h2 className="text-xl font-semibold text-primary">Clinic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="street" label="Street" value={formData.street} handleChange={handleChange} />
            <Input name="city" label="City" value={formData.city} handleChange={handleChange} required />
            <Input name="zipCode" label="ZIP Code" value={formData.zipCode} handleChange={handleChange} required />
            <Input name="province" label="Province" value={formData.province} handleChange={handleChange} />
            <Input name="mapLink" label="Map Link" value={formData.mapLink} handleChange={handleChange} />
            <div className="flex gap-2">
              <Input name="amount" type="number" label="Fee Amount" value={formData.consultationFee.amount} handleChange={(e)=>handleFeeChange("amount",e.target.value)} required />
              <select value={formData.consultationFee.currency} onChange={(e)=>handleFeeChange("currency",e.target.value)} className="input-field w-36">
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </section>

        <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primaryLight transition shadow-md">
          {submitting ? "Updating..." : "Update Doctor"}
        </button>
      </form>
    </div>
  );
};

export default EditDoctorPage;

/* ========== Reusable Components ========== */
const Input = ({ label, name, value, handleChange, type="text", required }) => (
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
    {values.map((v,i)=>(
      <div key={i} className="flex gap-2 mb-2">
        <input type="text" value={v} onChange={(e)=>handleChange(field,i,e.target.value)} className="input-field flex-1"/>
        <button type="button" onClick={()=>handleRemove(field,i)} className="px-3 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
      </div>
    ))}
    <button type="button" onClick={()=>handleAdd(field)} className="mt-2 px-4 py-1 bg-primary text-white rounded-lg hover:bg-primaryLight transition">Add {label.slice(0,-1)}</button>
  </div>
);
