"use client";

import { Hospital } from "lucide-react";
    
export default function HospitalPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-backgroundLight px-4 py-16 text-center">
      <div className="bg-white rounded-3xl shadow-lg p-12 max-w-2xl flex flex-col items-center">
        <Hospital size={64} className="text-primary mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Hospital Page
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          This section is under development. We{"'"}ll be adding hospital
          information soon.
        </p>
        <span className="inline-block bg-primary/10 text-primary font-semibold px-6 py-3 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
