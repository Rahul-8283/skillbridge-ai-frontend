import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const { login, isLoading, error: authError, user, isAuthenticated } = useAuth();

  // Navigate after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboard = user.role === "seeker" ? "/seeker-dashboard" : "/provider-dashboard";
      if (window.innerWidth >= 768) {
        toast.success(`Welcome ${user.name}! Redirecting to your dashboard...`);
      }
      navigate(dashboard);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email) {
      const err = "Please enter your email address.";
      setLocalError(err);
      return;
    }

    // Call backend API via authStore hook
    const result = await login(email, password);

    if (!result.success) {
      const errorMsg = result.error || "Login failed. Please try again.";
      setLocalError(errorMsg);
    }
    // If successful, the useEffect above will handle the navigation
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 flex items-center justify-center px-4">
      <motion.div className="max-w-md w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      > 
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <LogIn className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-blue-400">Sign In</h1>
          </div>

          {displayError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    passwordRef.current?.focus();
                  }
                }}
                disabled={isLoading}
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                ref={passwordRef}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              disabled={isLoading}
              className="text-blue-400 hover:text-blue-300 font-semibold disabled:opacity-50"
            >
              Sign up here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}