export function convertTo12Hour(time24) {
  if (!time24) return "";

  let [hour, minute] = time24.split(":").map(Number);

  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert 0 → 12

  return `${hour}:${minute.toString().padStart(2, "0")} ${suffix}`;
}
