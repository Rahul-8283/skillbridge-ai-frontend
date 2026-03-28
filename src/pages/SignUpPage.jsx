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
      const dashboard = user.role === "seeker" ? "/seeker-dashboard" : "/provider-dashboard";
      if (window.innerWidth >= 768) {
        toast.success(`Welcome ${user.name}! Your account has been created.`);
      }
      navigate(dashboard);
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
          </form>

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