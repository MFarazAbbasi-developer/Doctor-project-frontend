// src/utils/getProfileImage.js
export const getProfileImage = (profileImage) => {
  if (!profileImage) return "/default-image.avif"; // fallback
  return profileImage.startsWith("http://") || profileImage.startsWith("https://")
    ? profileImage // full URL (Google or external)
    : process.env.NEXT_PUBLIC_API_IMAGE + profileImage; // server-stored image
};
