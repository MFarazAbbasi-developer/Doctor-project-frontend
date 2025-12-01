// /lib/api.js
import axios from "axios";

export const API = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API,
  withCredentials: true, // keep this true only if backend uses cookies
  headers: {
    "Content-Type": "application/json",
  },
});
