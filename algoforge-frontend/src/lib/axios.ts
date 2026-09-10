import axios from "axios";
import Cookies from "js-cookie";

// Base URL is configurable so this frontend can point at any deployment
// of the existing Spring Boot backend without code changes.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("algoforge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      Cookies.remove("algoforge_token");
      Cookies.remove("algoforge_user");
      Cookies.remove("algoforge_role");
      Cookies.remove("algoforge_user_id");

      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
