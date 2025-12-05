import axios from "axios";
import { clearAccessToken, getAccessToken } from "./storage";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"; // adjust if needed

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to each request if present
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 403) {
      clearAccessToken();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
