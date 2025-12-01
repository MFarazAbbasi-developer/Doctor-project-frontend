import DoctorCard from "@/components/DoctorCard";
import { fetchDoctors } from "@/lib/fetchDoctors";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react"; // for list icons
import { Phone, CheckCircle2 } from "lucide-react";
import Search from "@/lib/search";

export default async function Home() {
  const data = await fetchDoctors({page:1, limit:3}); // fetch first 3 doctors for highlight

  return (
    <div className="bg-white w-full min-h-screen">
      {/* ================= HERO ================= */}
<section className="relative bg-[#E7F0FF] pt-16 pb-28 ">
  <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

    {/* LEFT CONTENT */}
    <div className="space-y-6 text-center md:text-left">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        <span className="text-[#1B3C74] block">Find the right Doctor</span>
        <span className="text-[#2B8AD4] block">Anytime, Anywhere!</span>
      </h1>

      <p className="text-[#5f6b7b] font-medium text-lg max-w-md mx-auto md:mx-0">
        Your health, your choice – connect with trusted doctors instantly.
      </p>

      <Link
        href="/find-doctors"
        className="
          inline-block 
          bg-primaryLight text-white px-7 py-3 
          rounded-xl font-semibold shadow-md 
          hover:bg-primary transition
        "
      >
        Search Doctors
      </Link>
    </div>

    {/* RIGHT IMAGE */}
    <div className="flex justify-center md:justify-end order-first md:order-last">
      <Image
        src="/2-doctors.png"
        width={480}
        height={480}
        alt="Doctors"
        className="
          w-[260px] sm:w-[320px] md:w-[420px] lg:w-[480px]
          rounded-2xl object-cover
        "
      />
    </div>

  </div>
</section>

{/* ================= SEARCH BAR ================= */}
<Search/>


      {/* ================= DOCTOR HIGHLIGHTS ================= */}
      <section className="container mx-auto px-6 md:px-12 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-primary">Top Doctors</h2>
          <Link
            href="/find-doctors"
            className="text-primaryLight font-medium hover:underline"
          >
            View All &gt;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.doctors.map((doctor, i) => (
            <DoctorCard key={i} doc={doctor} />
          ))}
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
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
            {/* Mission */}
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C427A]">
              Mission
            </h2>

            <p className="text-gray-600 mt-4 mb-10 leading-relaxed text-base md:text-lg">
              Our mission is to simplify healthcare access by connecting
              patients with top medical professionals through a seamless,
              tech-driven platform — making healthcare efficient, reliable, and
              accessible.
            </p>

            {/* Vision */}
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C427A] mb-6">
              Vision
            </h2>

            <ul className="space-y-4 text-base md:text-lg">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[#2B8AD4] w-6 h-6 mt-1" />
                <span className="text-gray-700">
                  To be the most trusted healthcare platform.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[#2B8AD4] w-6 h-6 mt-1" />
                <span className="text-gray-700">
                  Connect people with the right doctors and specialists.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[#2B8AD4] w-6 h-6 mt-1" />
                <span className="text-gray-700">
                  Ensure quality medical care anytime, anywhere.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
