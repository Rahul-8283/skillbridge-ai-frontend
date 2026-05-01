import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("seeker");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const { signup, isLoading, error: authError, user, isAuthenticated } = useAuth();

  // Navigate after successful signup
  useEffect(() => {
    if (isAuthenticated && user) {
      if (window.innerWidth >= 768) {
        toast.success(`Welcome ${user.name}! Your account has been created.`);
      }
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!fullName || !email || !password || !confirmPassword || !userType) {
      const err = "All fields are required";
      setLocalError(err);
      return;
    }

    if (password !== confirmPassword) {
      const err = "Passwords do not match";
      setLocalError(err);
      return;
    }

    if (password.length < 6) {
      const err = "Password must be at least 6 characters";
      setLocalError(err);
      return;
    }

    // Call backend API via authStore hook
    const result = await signup(email, password, fullName, userType);

    if (!result.success) {
      const errorMsg = result.error || "Sign up failed. Please try again.";
      setLocalError(errorMsg);
    }
  };

  const handleGoogleAuth = () => {
    // Redirect direct to the backend Google OAuth endpoint
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    window.location.href = `${backendUrl}/auth/google`;
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 flex items-center justify-center px-4">
    {/* <div className="min-h-screen bg-slate-950 text-white pt-20 flex flex-col items-center py-12 px-4 shadow-lg shadow-blue-500/20"> */}
      <motion.div className="max-w-md w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      > 
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <UserPlus className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-blue-400">Create account</h1>
          </div>

          {displayError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Full name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Role
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors cursor-pointer disabled:opacity-50"
              >
                <option value="seeker">Job Seeker</option>
                <option value="provider">Job Provider</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full bg-white hover:bg-gray-100 text-slate-900 font-semibold py-3 flex items-center justify-center rounded-lg transition-all"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              disabled={isLoading}
              className="text-blue-400 hover:text-blue-300 font-semibold disabled:opacity-50"
            >
              Sign in here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}