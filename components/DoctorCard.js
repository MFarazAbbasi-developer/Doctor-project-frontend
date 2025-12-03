"use client";
import { convertTo12Hour } from "@/utils/formatTime";
import Link from "next/link";
import { FaMapMarkerAlt, FaCheckCircle, FaClock, FaCalendarAlt, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const DoctorCard = ({ doc }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - rating < 1) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 duration-300 border border-gray-100">
  {/* Header */}
  <div className="flex items-start gap-4 p-5">
    <div className="relative flex-shrink-0">
      <img
        src={
          doc?.profileImage || "/default-image.avif"
        }
        alt="Doctor"
        className="rounded-full w-20 h-20 object-cover border-2 border-white shadow-md"
        onError={(e) => (e.currentTarget.src = "/default-image.avif")}
      />
      {doc.verified && (
        <FaCheckCircle className="absolute bottom-0 right-0 text-primaryLight bg-white rounded-full text-lg p-[2px] shadow-sm" />
      )}
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-xl text-primary truncate">
        {doc.name.firstName} {doc.name.lastName}
      </h3>

      <p className="mt-1 text-gray-600 text-sm truncate">
        {doc.specialization}
      </p>

      {/* Experience label */}
      {doc.experienceYears ? (
        <span className="inline-block mt-2 bg-primaryLight/10 text-primaryLight text-xs font-medium px-3 py-1 rounded-full">
          {doc.experienceYears} yrs experience
        </span>
      )
      :
      (<span className="inline-block mt-2 bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
          Experience not listed
        </span>
      )
    }

      {/* Rating */}
      <div className="flex items-center gap-2 mt-2 text-sm">
        {doc.totalReviews && doc.totalReviews > 0 ? (
          <>
            <div className="flex">{renderStars(doc.averageRating)}</div>
            <span className="text-gray-600 text-xs truncate">
              {doc.averageRating.toFixed(1)} ({doc.totalReviews} Reviews)
            </span>
          </>
        ) : (
          <span className="text-gray-500 text-xs">No reviews yet</span>
        )}
      </div>
    </div>
  </div>

  {/* Divider Line */}
  <div className="border-t border-gray-200"></div>

  {/* Body */}
  <div className="p-5 space-y-2">
    {doc.availability?.days?.length > 0 ? (
      <p className="flex items-center gap-2 text-gray-700 text-sm truncate">
        <FaCalendarAlt className="text-primaryLight" />{" "}
        {doc.availability.days.map((d) => d.slice(0, 3)).join(", ")}
      </p>
    )
    : (
      <p className="flex items-center gap-2 text-gray-700 text-sm truncate">
        <FaCalendarAlt className="text-primaryLight" />{" "}
        Availability not listed
      </p>
    )}

    {doc.availability?.timeSlots?.[0] ? (
      <p className="flex items-center gap-2 text-gray-700 text-sm truncate">
        <FaClock className="text-primaryLight" />{" "}
        {convertTo12Hour(doc.availability.timeSlots[0].start)} - {convertTo12Hour(doc.availability.timeSlots[0].end)}
      </p>
    ) : (
      <p className="flex items-center gap-2 text-gray-700 text-sm truncate">
        <FaClock className="text-primaryLight" />{" "}
        Timing not listed
      </p>
    )}

    {doc.clinicAddress?.city && (
      <p className="flex items-center gap-2 text-gray-700 text-sm truncate">
        <FaMapMarkerAlt className="text-primaryLight" />{" "}
        {doc.clinicAddress.area ? doc.clinicAddress.area + ", " : ""}
        {doc.clinicAddress.city}
      </p>
    )}

    {doc.consultationFee && (
      <p className="text-gray-800 font-medium text-sm truncate">
        Consultation Fee:{" "}
        <span className="text-primary font-semibold">
          {doc.consultationFee.currency || "PKR"} {doc.consultationFee.amount}
        </span>
      </p>
    )}
  </div>

  {/* Footer */}
  <div className="px-5 pb-5">
    <Link
      href={`/doctor/${doc._id}`}
      className="w-full block text-center bg-primary text-white py-2 rounded-xl hover:bg-primaryLight transition font-semibold"
    >
      View Profile
    </Link>
  </div>
</div>



  );
};

export default DoctorCard;
