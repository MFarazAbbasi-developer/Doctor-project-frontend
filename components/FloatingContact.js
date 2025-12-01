"use client";
import { Phone } from "lucide-react";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-20 right-4  sm:right-6 md:bottom-8 md:right-8 z-50">
      <button
        className="
          flex items-center gap-2 sm:gap-3 
          bg-[#2B8AD4] text-white 
          px-4 py-3 sm:px-5 sm:py-3 
          rounded-full shadow-lg 
          hover:bg-[#1C427A] transition-all duration-300
          backdrop-blur-md

          active:scale-95
        "
      >
        {/* Icon container */}
        <div className="bg-white/20 p-1.5 sm:p-2 rounded-full flex items-center justify-center">
          <Phone size={18} className="sm:w-[20px] sm:h-[20px] text-white" />
        </div>

        {/* Text disappears on smaller screens */}
        <span className="font-semibold hidden sm:block">
          Contact Us
        </span>
      </button>
    </div>
  );
}
