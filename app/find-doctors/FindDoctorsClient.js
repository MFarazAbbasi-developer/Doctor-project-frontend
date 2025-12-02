"use client";

import { useEffect, useState, useCallback } from "react";
import DoctorCard from "@/components/DoctorCard";
import { fetchDoctors } from "@/lib/fetchDoctors";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Select = dynamic(() => import("react-select"), { ssr: false });

// Custom react-select styles
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    padding: "0.25rem 0.5rem",
    borderRadius: "1rem",
    border: "1px solid #2B8AD4",
    boxShadow: "none",
    "&:hover": { borderColor: "#1C427A" },
  }),
  menu: (provided) => ({ ...provided, borderRadius: "1rem" }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#2B8AD4" : "#fff",
    color: state.isFocused ? "#fff" : "#000",
    cursor: "pointer",
  }),
};

export default function FindDoctorsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [specialization, setSpecialization] = useState(searchParams.get("specialization") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "mostExperienced");

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const limit = 12;
  const sortOptions = [
    { value: "mostExperienced", label: "Most Experienced" },
    { value: "newest", label: "Newest" },
    { value: "highestRated", label: "Highest Rated" },
    { value: "feeLowHigh", label: "Fees: Low to High" },
    { value: "feeHighLow", label: "Fees: High to Low" },
    { value: "mostReviewed", label: "Most Reviewed" },
    { value: "aToZ", label: "A → Z" },
    { value: "zToA", label: "Z → A" },
  ];

  const getDoctors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchDoctors({ page, limit, search, specialization, city, sort });
      setDoctors(data.doctors || []);
      setTotalPages(data.totalPages || 1);

      if (!specializationOptions.length && data.filters?.specializations) {
        setSpecializationOptions(data.filters.specializations.map((s) => ({ value: s, label: s })));
      }
      if (!cityOptions.length && data.filters?.cities) {
        setCityOptions(data.filters.cities.map((c) => ({ value: c, label: c })));
      }
    } catch {
      setError("Failed to fetch doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, specialization, city, sort, specializationOptions.length, cityOptions.length]);

  useEffect(() => {
    const timeout = setTimeout(() => getDoctors(), 400);
    return () => clearTimeout(timeout);
  }, [getDoctors]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page);
    if (search) params.set("search", search);
    if (specialization) params.set("specialization", specialization);
    if (city) params.set("city", city);
    if (sort) params.set("sort", sort);
    router.replace(`/find-doctors?${params.toString()}`);
  }, [page, search, specialization, city, sort, router]);

  const resetFilters = () => {
    setSearch("");
    setSpecialization("");
    setCity("");
    setPage(1);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-primaryLight to-[#1C427A] px-6 lg:px-20 py-20 text-white">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow">
            Find the Right Doctor
          </h1>
          <p className="text-white/90 text-lg">
            Search by specialization, city, or name — your care starts here.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Select
            placeholder="Sort By"
            options={sortOptions}
            value={sortOptions.find((opt) => opt.value === sort)}
            onChange={(val) => {
              setPage(1);
              setSort(val.value);
            }}
            styles={customSelectStyles}
            isSearchable={false}
          />

          <Select
            placeholder="Select Specialization"
            options={specializationOptions}
            value={
              specializationOptions.find(
                (opt) => opt.value === specialization
              ) || null
            }
            onChange={(val) => {
              setPage(1);
              setSpecialization(val?.value || "");
            }}
            styles={customSelectStyles}
            isSearchable
            isClearable
          />

          <Select
            placeholder="Select City"
            options={cityOptions}
            value={cityOptions.find((opt) => opt.value === city) || null}
            onChange={(val) => {
              setPage(1);
              setCity(val?.value || "");
            }}
            styles={customSelectStyles}
            isSearchable
            isClearable
          />
        </div>
      </section>

      {/* DOCTORS GRID */}
      <section className="px-6 lg:px-20 py-16 bg-backgroundLight min-h-screen">

        {search && (
          <div className="max-w-6xl mx-auto mb-6 px-4 flex items-center justify-center gap-4 text-gray-700 text-lg font-medium">
            <span>
              Showing results for:{" "}
              <span className="font-semibold">{search}</span>
            </span>

            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="flex items-center justify-center w-6 h-6 text-gray-500 hover:bg-gray-200 rounded-full transition"
              aria-label="Clear search"
            >
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl shadow animate-pulse h-72"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-20">{error}</div>
        ) : doctors.length === 0 ? (
          <div className="text-center mt-20">
            <img
              src="/doctor-not-found.avif"
              className="w-48 mx-auto rounded-full"
              alt="No Doctors Found"
            />
            <h2 className="text-2xl font-semibold mt-6 text-primary">
              No doctors match your search
            </h2>
            <p className="text-gray-600 mt-2">
              Try different filters or search terms.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-2xl hover:bg-primaryLight transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => (
              <DoctorCard key={doc._id} doc={doc} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && doctors.length > 0 && (
          <div className="flex justify-center items-center gap-1 mt-12">
            {/* Previous */}
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
              className="p-2 border bg-white text-gray-700 rounded-md 
                 hover:bg-gray-100 transition 
                 disabled:opacity-40 disabled:hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {(() => {
              const pages = [];
              const totalNumbers = 5;
              const totalBlocks = totalNumbers + 2;

              if (totalPages <= totalBlocks) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                const left = Math.max(2, page - 1);
                const right = Math.min(totalPages - 1, page + 1);

                pages.push(1);

                if (left > 2) pages.push("left-ellipsis");

                for (let i = left; i <= right; i++) pages.push(i);

                if (right < totalPages - 1) pages.push("right-ellipsis");

                pages.push(totalPages);
              }

              return pages.map((p, i) => {
                if (p === "left-ellipsis" || p === "right-ellipsis") {
                  return (
                    <span key={i} className="px-3 py-2 text-gray-500">
                      …
                    </span>
                  );
                }

                return (
                  <button
                    key={i}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 text-sm rounded-md border transition
              ${
                p === page
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
                  >
                    {p}
                  </button>
                );
              });
            })()}

            {/* Next */}
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages}
              className="p-2 border bg-white text-gray-700 rounded-md 
                 hover:bg-gray-100 transition 
                 disabled:opacity-40 disabled:hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </>
  );
}
