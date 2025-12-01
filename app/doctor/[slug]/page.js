"use client";
import ReviewCard from "@/components/ReviewCard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  Building,
  Clock,
  CreditCard,
  Hash,
  MapPin,
  Star,
} from "lucide-react";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { Hand, Stethoscope, BadgeCheck, DollarSign } from "lucide-react";

import { GraduationCap, Award, Globe, Briefcase, Check } from "lucide-react";
import { convertTo12Hour } from "@/utils/formatTime";
export default function DoctorProfile() {
  const { slug } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const sectionClasses =
    "bg-primaryLight text-white p-6 rounded-2xl shadow-lg w-full lg:w-[48%]";
  const itemClasses = "text-sm leading-relaxed mt-3";

  useEffect(() => {
    if (!slug) return;
    const getDoctorInfo = async () => {
      try {
        const { data } = await api.get(`/doctor/get/${slug}`);
        if (!data.doctor) {
          setNotFound(true);
        } else {
          setDoctor(data.doctor);
        }
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    getDoctorInfo();
  }, [slug]);

  if (loading)
    return (
      <section className="bg-custom-gradient px-6 lg:px-20 pt-16 pb-16 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          {/* LEFT TEXT SKELETON */}
          <div className="flex flex-col gap-4">
            <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 w-64 bg-gray-300 rounded animate-pulse"></div>

            <div className="h-4 w-full bg-gray-300 rounded animate-pulse mt-3"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse"></div>

            <div className="h-5 w-48 bg-gray-300 rounded animate-pulse mt-3"></div>
            <div className="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* RIGHT IMAGE SKELETON */}
          <div className="flex justify-center md:justify-end order-first md:order-last">
            <div className="w-72 h-72 md:w-80 md:h-80 rounded-full bg-gray-300 animate-pulse border-4 border-gray-200 shadow-lg"></div>
          </div>
        </div>
      </section>
    );

  if (notFound)
    return (
      <div className="w-full flex flex-col items-center justify-center py-32 px-6">
        <Image
          src="/doctor-not-found.avif" // optional illustration
          alt="Doctor Not Found"
          width={200}
          height={200}
          className="rounded-full"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-primary mt-6">
          Doctor Not Found
        </h1>
        <p className="text-gray-600 mt-2 text-center max-w-md">
          The doctor you are looking for does not exist, has been removed, or is
          temporarily unavailable. Please check back later or search for another
          doctor.
        </p>
      </div>
    );
  return (
    <div className="w-full">
      {/* ==================== HERO SECTION ==================== */}
      <section
        className="relative px-4 sm:px-6 lg:px-20 pt-16 pb-14 
  bg-gradient-to-br from-[#2B8AD4] via-[#1C427A] to-[#102B54] text-white/90"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          {/* LEFT CONTENT */}
          <div className="space-y-4 md:space-y-5 text-center md:text-left">
            {/* Greeting */}
            <h3 className="text-base sm:text-lg font-medium flex items-center justify-center md:justify-start gap-2 text-white/80">
              <Hand className="w-5 h-5 text-white/90" />
              Hi, I am
            </h3>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-sm">
              Dr. {doctor?.name?.firstName} {doctor?.name?.lastName}
            </h1>

            {/* Description */}
            <p className="text-white/75 leading-relaxed max-w-lg mx-auto md:mx-0 text-sm sm:text-base">
              {doctor?.bio || "No description available"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-3">
              {/* Specialization Badge */}
              <span
                className="min-w-[140px] px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
    rounded-full text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm"
              >
                <Stethoscope className="w-4 h-4" />
                {doctor?.specialization}
              </span>

              {/* Experience Badge */}
              <span
                className="min-w-[140px] px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
    rounded-full text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm"
              >
                <BadgeCheck className="w-4 h-4" />
                {doctor?.experienceYears} Years
              </span>

              {/* Rating & Review Stats */}
              <span
                className="min-w-[150px] px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 
    rounded-full text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm"
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {doctor?.averageRating.toFixed(1) || 0} / 5 (
                {doctor?.totalReviews || 0} Reviews)
              </span>

              {/* Fee Badge */}
              <span
                className="min-w-[140px] px-3 py-2 bg-primaryLight/90 text-white rounded-full 
    font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {doctor?.consultationFee
                  ? `${doctor.consultationFee.amount} ${doctor.consultationFee.currency}`
                  : "N/A"}
              </span>
            </div>

            {/* Clinic Address & Availability */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-3 pt-4 text-white/80 text-sm sm:text-base">
              {/* Address */}
              <span className="min-w-[180px] flex items-start gap-1">
                <MapPin className="w-4 h-4 mt-0.5" />
                {doctor?.clinicAddress?.street &&
                  `${doctor.clinicAddress.street}, `}
                {doctor?.clinicAddress?.city}, {doctor?.clinicAddress?.province}{" "}
                {doctor?.clinicAddress?.zipCode},{" "}
                {doctor?.clinicAddress?.country}
              </span>

              {/* Availability */}
              {doctor?.availability?.days?.length > 0 && (
                <span className="min-w-[180px] flex items-start gap-1">
                  <Clock className="w-4 h-4 mt-0.5" />
                  {doctor.availability.days
                    .map((day) => day.slice(0, 3)) // abbreviate to 3 letters
                    .join(", ")}
                  :{" "}
                  {doctor.availability.timeSlots.map((slot, i) => (
                    <span key={i}>
                      {convertTo12Hour(slot.start)} - {convertTo12Hour(slot.end)}
                      {i < doctor.availability.timeSlots.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center md:justify-end order-first md:order-last">
            <div className="relative">
              {/* Softer Background Glow */}
              <div
                className="absolute inset-0 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 
          bg-white/10 blur-3xl rounded-full"
              ></div>

              <img
                src={doctor?.profileImage || "/default-image.avif"}
                alt="Doctor"
                className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 
          rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-backgroundLight">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="px-6 lg:px-20 text-3xl md:text-4xl font-bold text-primary drop-shadow-sm">
            Services Offered
          </h2>
          <p className="px-6 lg:px-20 mt-3 text-gray-600 max-w-2xl mx-auto text-lg">
            Explore the treatments and consultations provided by Dr.{" "}
            {doctor?.name?.firstName} {doctor?.name?.lastName}.
          </p>

          {/* Services list */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 px-6 lg:px-0">
            {(doctor?.services || []).map((service, idx) => (
              <span
                key={idx}
                className="inline-block px-6 py-3 bg-primary/10 text-primary font-semibold rounded-full shadow-md"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Availability */}
      {/* <section className="px-6 lg:px-20 py-16 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary drop-shadow-sm">
            Doctor{"'"}s Availability
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-lg">
            Check the days and time slots when Dr. {doctor?.name?.firstName}{" "}
            {doctor?.name?.lastName} is available for consultation.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {doctor?.availability?.days?.map((day, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <span className="text-primary font-semibold text-lg mb-2">
                  {day}
                </span>

                <div className="flex flex-col gap-2 w-full">
                  {doctor?.availability?.timeSlots?.map((slot, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium shadow-sm hover:bg-primary/20 transition-colors duration-300"
                    >
                      <Clock className="w-4 h-4 text-primary" />
                      <span>
                        {slot.start} - {slot.end}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* <section className="px-6 lg:px-20 py-16 bg-white">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-primary drop-shadow-sm">
      Clinic Address
    </h2>
    <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-lg">
      Visit Dr. {doctor?.name?.firstName} {doctor?.name?.lastName} at the clinic.
    </p>

    <div className="mt-10 bg-white border border-gray-200 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      
      <div className="flex-1 space-y-3 text-left">
        <div className="flex items-center gap-3">
          <i className="text-primary">
            <MapPin className="w-5 h-5" />
          </i>
          <span className="text-gray-700 font-medium">
            {doctor?.clinicAddress?.street || "Street info not provided"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <i className="text-primary">
            <Building className="w-5 h-5" />
          </i>
          <span className="text-gray-700 font-medium">
            {doctor?.clinicAddress?.city}, {doctor?.clinicAddress?.province || ""}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <i className="text-primary">
            <Hash className="w-5 h-5" />
          </i>
          <span className="text-gray-700 font-medium">
            {doctor?.clinicAddress?.zipCode}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <i className="text-primary">
            <Globe className="w-5 h-5" />
          </i>
          <span className="text-gray-700 font-medium">
            {doctor?.clinicAddress?.country || "Pakistan"}
          </span>
        </div>
      </div>

      {doctor?.clinicAddress?.mapLink && (
        <a
          href={doctor.clinicAddress.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-full md:w-64 h-40 bg-primary/10 rounded-xl flex items-center justify-center hover:bg-primary/20 transition"
        >
          <MapPin className="w-12 h-12 text-primary" />
          <span className="sr-only">Open in Google Maps</span>
        </a>
      )}
    </div>
  </div>
</section> */}

      {/* ==================== WORKING HISTORY ==================== */}
      {/* <section className="bg-white px-6 lg:px-20 py-20">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-primary">
          Working History
        </h2>

        <p className="text-center text-gray-600 mt-2">
          Dedicated years of expertise in leading hospitals, providing
          exceptional cardiac care and treatment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-7xl mx-auto">
          <div className=" rounded-lg shadow-lg p-4">
            <Image
              src="/image-02-1.png"
              width={500}
              height={250}
              alt="Hospital"
              className="rounded-md object-cover"
            />

            <div className="mt-3">
              <p className="text-sm text-gray-400">Current Clinic</p>
              <h3 className="text-lg font-semibold text-primary">
                {doctor?.clinicAddress?.street || "Clinic Street"},{" "}
                {doctor?.clinicAddress?.city}
              </h3>

              <p className="text-gray-600 text-sm mt-1">
                Providing high-quality healthcare services in{" "}
                {doctor?.clinicAddress?.city}, {doctor?.clinicAddress?.province}
                .
              </p>
            </div>
          </div>

          <div className="border rounded-lg shadow-sm p-4 opacity-50">
            <p className="text-center text-gray-400">
              More history coming soon…
            </p>
          </div>

          <div className="border rounded-lg shadow-sm p-4 opacity-50">
            <p className="text-center text-gray-400">
              More history coming soon…
            </p>
          </div>
        </div>
      </section> */}

      {/* ==================== QUALIFICATIONS SECTION ==================== */}
      <section className="bg-backgroundLight px-6 lg:px-20 py-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            My Qualifications
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Academic milestones, licenses, certifications, languages, and
            expertise.
          </p>
        </div>

        {/* 4 Cards Layout */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Academic Qualifications */}
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <div className="bg-primaryLight p-6 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-white" />
              <h3 className="text-white font-semibold text-lg">
                Academic Qualifications
              </h3>
            </div>
            <div className="bg-backgroundLight p-6 space-y-4">
              {doctor?.educationBackground?.length ? (
                doctor.educationBackground.map((edu, idx) => (
                  <div
                    key={idx}
                    className="pb-2 border-b border-gray-200 last:border-none flex items-start gap-2"
                  >
                    <Check className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{edu.degree}</p>
                      <p className="text-gray-600 text-sm">{edu.institution}</p>
                      <p className="text-gray-500 text-xs mt-1">{edu.year}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No academic data provided.</p>
              )}
            </div>
          </div>

          {/* Licenses & Certifications */}
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <div className="bg-primaryLight p-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-white" />
              <h3 className="text-white font-semibold text-lg">
                Licenses & Certifications
              </h3>
            </div>
            <div className="bg-backgroundLight p-6 space-y-4">
              {doctor?.certifications?.length ? (
                doctor.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="pb-2 border-b border-gray-200 last:border-none flex items-start gap-2"
                  >
                    <Check className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{cert.title}</p>
                      <p className="text-gray-600 text-sm">
                        {cert.organization}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{cert.year}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No certifications available.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== REVIEWS SECTION ==================== */}
      <ReviewsSection doctor={doctor} />

      {/* ================= ABOUT US ================= */}
      {doctor?.description && (
        <section className="relative w-full bg-[#F6F9FF] py-16 md:py-20 px-6 md:px-16 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center">
            {/* LEFT IMAGES */}
            <div className="relative w-full max-w-md mx-auto h-[320px] sm:h-[360px] md:h-[420px]">
              {/* Top Image */}
              <img
                src="/homepage-image-2.png"
                alt="Healthcare"
                className="
                absolute top-0 right-0 
                w-56 md:w-72 
                rounded-xl shadow-xl object-cover
              "
              />

              {/* Bottom Image */}
              <img
                src="/homepage-image-1.png"
                alt="Doctors"
                className="
                absolute bottom-0 left-0 
                w-56 md:w-72 
                rounded-xl shadow-xl object-cover
              "
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="text-left max-w-xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C427A]">
                About Doctor
              </h2>

              <p className="text-gray-600 mt-4 mb-10 leading-relaxed text-base md:text-lg">
                {doctor?.description}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const ReviewsSection = ({ doctor }) => {
  const { isAuthenticated, user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hover, setHover] = useState(0);

  // To Edit Review
  const [editingReview, setEditingReview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [saving, setSaving] = useState(false);

  // Sort reviews to have user's review on top
  useEffect(() => {
    if (!loading) {
      setReviews((prev) => {
        if (!isAuthenticated) return prev;

        const userReview = prev.find((r) => r.patientId === user?._id);
        const others = prev.filter((r) => r.patientId !== user?._id);

        return userReview ? [userReview, ...others] : prev;
      });
    }
  }, [loading, isAuthenticated]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get(
          `/reviews/get-all-reviews/${doctor?._id}`
        );
        if (data.success) setReviews(data.reviews);
        console.log(data.reviews);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [doctor]);

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || rating === 0) {
      setError("Please provide a rating and comment");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { data } = await api.post(`/reviews/add-review/${doctor?._id}`, {
        rating,
        comment,
        // patientId: user?.id, // pass logged-in user's id
      });

      if (data.success) {
        // Add new review to the top
        setReviews([data.review, ...reviews]);
        setComment("");
        setRating(0);
        toast.success("Review submitted successfully!");
      } else {
        setError(data.message || "Failed to submit review");
      }
    } catch (err) {
      // console.error(err);
      // setError("Something went wrong while submitting review");
      // Handle duplicate review (MongoDB E11000)
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong while submitting review");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (reviewId) => {
    setDeleteConfirm(reviewId); // open custom modal
  };

  const confirmDelete = async (reviewId) => {
    try {
      const { data } = await api.delete(`/reviews/delete-review/${reviewId}`);

      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        toast.success("Review deleted successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };
  const handleSaveEdit = async () => {
    try {
      setSaving(true);

      const { data } = await api.put(
        `/reviews/edit-review/${editingReview.id}`,
        {
          comment: editComment,
          rating: editRating,
        }
      );

      if (data.success) {
        // update UI list
        setReviews((prev) =>
          prev.map((r) => (r.id === editingReview.id ? data.review : r))
        );

        setEditingReview(null);
        toast.success("Review updated successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update review");
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => {
    if (!loading && window.location.hash === "#reviews") {
      const el = document.getElementById("reviews");
      if (el) {
        setTimeout(() => {
          const yOffset = -100; // adjust for navbar height
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });
        }, 50); // slight delay ensures content is rendered
      }
    }
  }, [loading]);

  return (
    <section id="reviews" className="px-6 lg:px-20 py-20 bg-backgroundLight">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary drop-shadow-sm">
          Patient Feedback
        </h2>
        <p className="text-gray-600 text-lg mt-2">
          Real experiences shared by patients of Dr. {doctor?.name?.firstName}{" "}
          {doctor?.name?.lastName}.
        </p>

        <div
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 
      rounded-full bg-primary/10 text-primary font-medium"
        >
          <Star className="text-yellow-500 fill-yellow-500" />{" "}
          {doctor?.averageRating || 0} / 5 — {doctor?.totalReviews || 0} Reviews
        </div>
      </div>

      {/* Write Review Card */}
      {isAuthenticated ? (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-gradient-to-br from-white to-[#F7FAFF] 
      p-8 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm space-y-5"
        >
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Rating */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                const active = value <= (hover || rating);

                return (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(value)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        active
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full p-3 border rounded-xl bg-white/70 focus:ring-2 
          focus:ring-primaryLight focus:outline-none"
              placeholder="Share your experience..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-primaryLight text-white 
        hover:bg-primary transition font-semibold shadow-md"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          Please{" "}
          <a
            href={`/login?redirect=${encodeURIComponent(
              typeof window !== "undefined"
                ? window.location.pathname + "#reviews"
                : ""
            )}`}
            className="text-primary hover:underline font-medium"
          >
            login
          </a>{" "}
          to write a review.
        </p>
      )}

      {/* Reviews List */}
      <div className="max-w-3xl mx-auto mt-16 space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <ReviewCard
              key={rev.id}
              review={rev}
              onDelete={handleDelete}
              onEdit={handleEditClick}
            />
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
            <h2 className="text-lg font-semibold text-primary mb-3">
              Edit Review
            </h2>

            <textarea
              className="w-full border p-3 rounded-xl"
              rows={4}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            />

            <div className="flex gap-2 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} onClick={() => setEditRating(i + 1)}>
                  <Star
                    className={`w-6 h-6 ${
                      i < editRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primary text-white rounded-xl"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                Delete Review?
              </h2>
            </div>

            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
              Are you sure you want to delete your review? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => confirmDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
