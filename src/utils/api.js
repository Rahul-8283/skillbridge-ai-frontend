import axios from "axios";
import { toast } from "react-toastify";

const isProd = import.meta.env.MODE === "production";
const backendURL = isProd ? import.meta.env.VITE_BACKEND_URL_PROD : import.meta.env.VITE_BACKEND_URL_DEV;

const api = axios.create({
  baseURL: `${backendURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 180000, // 180 sec
});

// Request Interceptor - Add Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if(token){
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
    const isMobile = window.innerWidth < 768;

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

    if(error.response?.status === 401){
      const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/signup');
      
      if(isAuthRequest){
        const errorMessage = error.response?.data?.message || 'Authentication failed. Please try again.';
        console.warn("Auth error:", errorMessage);
      } 
      else{
        showToast("Session expired. Please login again.");
        console.warn("Unauthorized - redirecting to login");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } 
    else if(error.response?.status === 403){
      showToast("Forbidden - insufficient permissions.");
      console.error("Forbidden - insufficient permissions");
    } 
    else if(error.response?.status === 404){
      if(!error.config?.url?.includes('/profile')) {
        showToast("Resource not found.");
      }
      console.error("Resource not found");
    } 
    else if(error.response?.status === 500) {
      showToast("Server error. Please try again later.");
      console.error("Server error - Backend service might be down");
    } 
    else if(!error.response){
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