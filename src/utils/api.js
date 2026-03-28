import axios from "axios";
import { toast } from "react-toastify";

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
  timeout: 30000, // 30 seconds timeout
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
      // Check if this is a login/signup request or a token-related error
      const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/signup');
      
      if (isAuthRequest) {
        // For login/signup errors, show the specific error message from backend
        const errorMessage = error.response?.data?.message || 'Authentication failed. Please try again.';
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
        });
        console.warn("Auth error:", errorMessage);
      } else {
        // For other 401 (token expired), redirect to login
        toast.error("Session expired. Please login again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
        });
        console.warn("Unauthorized - redirecting to login");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      toast.error("Forbidden - insufficient permissions.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
      console.error("Forbidden - insufficient permissions");
    } else if (error.response?.status === 404) {
      toast.error("Resource not found.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
      console.error("Resource not found");
    } else if (error.response?.status === 500) {
      toast.error("Server error. Backend service might be down. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
      console.error("Server error - Backend service might be down");
    } else if (!error.response) {
      // Network error (backend not running)
      toast.error("Unable to connect to server. Please check if backend is running.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
      console.error("Network Error:", error.message);
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
