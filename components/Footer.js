"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Logo</h2>
          <p className="text-sm text-gray-200">
            Connecting patients with trusted doctors and medical services. Your health is our priority.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4 text-[#2F92E0]">About Us</h3>
          <ul className="space-y-2 text-gray-200 ">
            <li><Link href="/" className="hover:text-backgroundLight transition">Home</Link></li>
            <li><Link href="/find-doctors" className="hover:text-backgroundLight transition">Find Doctors</Link></li>
            <li><Link href="/hospitals" className="hover:text-backgroundLight transition">Hospitals</Link></li>
            {/* <li><Link href="/medicines" className="hover:text-backgroundLight transition">Medicines</Link></li>
            <li><Link href="/Surgeries" className="hover:text-backgroundLight transition">Surgeries</Link></li> */}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-4 text-[#2F92E0]">Services</h3>
          <ul className="space-y-2 text-gray-200 ">
            <li><Link href="/" className="hover:text-backgroundLight transition">Help Center</Link></li>
            <li><Link href="/" className="hover:text-backgroundLight transition">Contact Us</Link></li>
            <li><Link href="/" className="hover:text-backgroundLight transition">Facilities</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-4 text-[#2F92E0]">Contact Us</h3>
          <p className="text-gray-200">123 Health Street, Karachi, Pakistan</p>
          <p className="text-gray-200 mt-1">Email: support@projectname.com</p>
          <p className="text-gray-200 mt-1">Phone: +92 300 1234567</p>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-10 border-t border-primaryLight pt-4 text-center text-gray-300 text-sm">
        &copy; {new Date().getFullYear()} Project name. All rights reserved.
      </div>


      {/* Prevent content from hiding behind bottom nav */}
      <div className="md:hidden h-16"></div>
    </footer>
  );
}
