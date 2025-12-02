/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    domains: [
      "localhost",
      "temp", // replace with your actual backend domain
      "res.cloudinary.com",          // if using cloud storage like Cloudinary
    ],
  },
};

export default nextConfig;