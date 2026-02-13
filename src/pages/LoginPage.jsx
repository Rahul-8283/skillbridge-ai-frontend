import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    // Store user data in localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: email.split("@")[0],
        email: email,
      })
    );

    // Navigate to home
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <LogIn className="w-8 h-8 text-teal-400" />
            <h1 className="text-3xl font-bold text-teal-400">Sign In</h1>
          </div>

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
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-teal-400 focus:outline-none transition-colors"
              />
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
                className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-teal-400 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-teal-400 hover:text-teal-300 font-semibold"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}