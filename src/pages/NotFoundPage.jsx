import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Heading */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Page Not Found</h2>
          <p className="text-base sm:text-lg text-gray-400 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-300 border border-slate-700 hover:border-slate-600"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            <Home className="w-4 sm:w-5 h-4 sm:h-5" />
            Go Home
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-700">
          <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">Quick links:</p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center text-xs sm:text-sm">
            <button
              onClick={() => navigate("/")}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Home
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => navigate("/about")}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              About
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Dashboard
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
