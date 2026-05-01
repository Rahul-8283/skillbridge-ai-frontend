import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import api from "../utils/api";
import { toast } from "react-toastify";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuthData = useAuthStore((state) => state.setAuthData); // Need to add this helper

  useEffect(() => {
    const handleOAuth = async () => {
      // Extract the query parameters
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("token");

      if (token) {
        // Save the token first so our axios instance can use it
        localStorage.setItem("access_token", token);
        
        try {
          const response = await api.get("/auth/me");
          const user = response.user || response.data?.user || response;
          
          localStorage.setItem("user", JSON.stringify(user));
          
          // Update the global store directly since we imported its setState
          useAuthStore.setState({ user, token, isAuthenticated: true, isLoading: false });

          // Clean token redirect
          if (user.role === "pending") {
            navigate("/role-selection", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
          
          toast.success("Successfully logged in with Google");
        } catch (error) {
          console.error("Failed to fetch user after OAuth:", error);
          toast.error("Failed to initialize session after Google Login.");
          navigate("/login", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    };

    handleOAuth();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default OAuthCallback;