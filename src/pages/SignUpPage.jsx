import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("job-seeker");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword || !userType) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Get registered users from localStorage
    const registeredUsersStr = localStorage.getItem("registeredUsers");
    const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];

    // Check if email already exists
    const emailExists = registeredUsers.some((user) => user.email === email);
    if (emailExists) {
      alert("Email already registered. Please sign in instead.");
      return;
    }

    // Add new user to registered users
    const newUser = {
      name: fullName,
      email: email,
      password: password,
      role: userType,
    };
    registeredUsers.push(newUser);

    // Store updated registered users
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    // Set current user as logged in
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: fullName,
        email: email,
        role: userType,
      })
    );

    // Navigate to appropriate dashboard
    navigate(userType === "job-seeker" ? "/seeker-dashboard" : "/provider-dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 flex items-center justify-center px-4">
      <motion.div className="max-w-md w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        translate={{ duration: 1.9 }}
      > 
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <UserPlus className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-blue-400">Create account</h1>
          </div>

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
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
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
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Role
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="job-seeker">Job Seeker</option>
                <option value="job-provider">Job Provider</option>
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
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
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
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-teal-400 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Sign in here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}