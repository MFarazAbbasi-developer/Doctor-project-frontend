// /lib/fetchDoctors.js
import { api } from "./api";

export async function fetchDoctors({
  page = 1,
  limit = 10,
  search = "",
  specialization = "",
  city = "",
  sort = "mostExperienced" // default sort
}) {
  try {
    const res = await api.get("/doctor/get-all", {
      params: { page, limit, search, specialization, city, sort },
    });

    return res.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);
    return { success: false };
  }
}
