"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const handleSearch = () => {
    if (!searchInput.trim()) return; // don't search empty
    router.push(
      `/find-doctors?search=${encodeURIComponent(searchInput.trim())}`
    );
  };
  return (
    <section className="relative -mt-20 md:-mt-16 z-30 mb-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          className="
      bg-white shadow-xl rounded-2xl 
      px-6 py-6 md:py-8 
      flex flex-col md:flex-row items-center gap-4
    "
        >
          <input
            type="text"
            placeholder="Search by name, specialization, city..."
            value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
            className="
          flex-1 w-full p-3 md:p-4 rounded-xl border border-gray-200 
          outline-none text-gray-700
          focus:ring-2 focus:ring-primaryLight
        "
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button
          onClick={handleSearch}
            className="
        bg-primaryLight text-white px-6 py-3 
        rounded-xl font-semibold shadow-md 
        hover:bg-primary transition w-full md:w-auto
      "
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default Search;
