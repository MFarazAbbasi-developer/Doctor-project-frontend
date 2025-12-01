"use client";
import { useState } from "react";
import { Star, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ReviewCard = ({ review, onDelete, onEdit }) => {
  const { user } = useAuth();
  const isOwner = user?._id === review.patientId;
  const [showFull, setShowFull] = useState(false);

  const truncatedComment =
    review.comment.length > 150 && !showFull
      ? review.comment.slice(0, 150) + "..."
      : review.comment;

  return (
    <div
      className={`relative rounded-2xl p-6 border transition-all
        ${
          isOwner
            ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/10"
            : "bg-white border-gray-100 shadow-md hover:shadow-xl"
        }
      `}
    >
      {/* Edit/Delete icons */}
      {isOwner && (
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <button
            onClick={() => onEdit(review)}
            className="text-primaryLight hover:text-primary transition"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(review.id)}
            className="text-red-500 hover:text-red-700 transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* User Profile */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center 
          font-semibold text-lg shadow 
          ${
            isOwner
              ? "bg-primary text-white"
              : "bg-primaryLight text-white"
          }`}
        >
          {review.patientName.charAt(0)}
        </div>

        <div>
          <p className="font-semibold text-gray-900">{review.patientName}</p>
          <p className="text-gray-400 text-xs">
            {new Date(review.date).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed">
        {showFull ? review.comment : truncatedComment}
      </p>

      {review.comment.length > 150 && (
        <button
          onClick={() => setShowFull(!showFull)}
          className="text-primaryLight font-medium text-sm mt-2"
        >
          {showFull ? "Show less" : "Read more"}
        </button>
      )}

      {/* Rating */}
      <div className="flex gap-1 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < review.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;
