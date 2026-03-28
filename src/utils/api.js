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
    // Check if the device is a mobile device (sm breakpoint and below)
    const isMobile = window.innerWidth < 768;

    // Helper function to show toast only on non-mobile devices
    const showToast = (message, status = 'error') => {
      if (!isMobile) {
        toast[status](message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
        });
      }
    };

    // Handle different error scenarios
    if (error.response?.status === 401) {
      // Check if this is a login/signup request or a token-related error
      const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/signup');
      
      if (isAuthRequest) {
        // For login/signup errors, components will handle displaying the specific error message locally
        const errorMessage = error.response?.data?.message || 'Authentication failed. Please try again.';
        console.warn("Auth error:", errorMessage);
        // NO TOAST for auth requests to avoid redundancy with inline form errors
      } else {
        // For other 401 (token expired), redirect to login
        showToast("Session expired. Please login again.");
        console.warn("Unauthorized - redirecting to login");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      showToast("Forbidden - insufficient permissions.");
      console.error("Forbidden - insufficient permissions");
    } else if (error.response?.status === 404) {
      // Don't toast 404s for profile checks (expected sometimes)
      if (!error.config?.url?.includes('/profile')) {
        showToast("Resource not found.");
      }
      console.error("Resource not found");
    } else if (error.response?.status === 500) {
      showToast("Server error. Please try again later.");
      console.error("Server error - Backend service might be down");
    } else if (!error.response) {
      // Network error (backend not running or timeout)
      showToast("Unable to connect to server. Please check your connection.");
      console.error("Network/Timeout Error:", error.message);
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
