export function convertTo12Hour(time) {
  if (!time) return "";

  // If time already has AM/PM, return as-is (normalize spacing)
  if (/AM|PM/i.test(time)) {
    return time.toUpperCase().replace(/\s+/g, " ").trim();
  }

  // Otherwise, assume 24-hour format
  let [hour, minute] = time.split(":").map(Number);
  if (isNaN(hour) || isNaN(minute)) return "";

  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert 0 → 12

  return `${hour}:${minute.toString().padStart(2, "0")} ${suffix}`;
}
