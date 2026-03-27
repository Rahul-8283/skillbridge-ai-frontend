import axios from "axios";

// Determine backend URL based on environment
const mode = import.meta.env.VITE_APP_MODE || "development";
const backendURL =
  mode === "production"
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL_DEV;

// Create axios instance with default config
const api = axios.create({
  baseURL: backendURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor - Add Access Token
api.interceptors.request.use(
  (config) => {
    // Get access token from localStorage (set by backend after login)
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle Errors & Token Refresh
api.interceptors.response.use(
  (response) => {
    // Success response
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
      if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn("Unauthorized - redirecting to login");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      console.error("Forbidden - insufficient permissions");
    } else if (error.response?.status === 404) {
      console.error("Resource not found");
    } else if (error.response?.status === 500) {
      console.error("Server error - Backend service might be down");
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
