import { Menu, X, LogIn, LogOut, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar({ scrolled }) {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userThere = isAuthenticated && user;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDashboard = () => {
    if (!userThere) {
      alert("Please sign in to access your dashboard");
      navigate("/login");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-slate-950/80 backdrop-blur-lg border-b border-slate-800"
          : "bg-slate-950/20 backdrop-blur-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          <div className="flex items-center space-x-1 group cursor-pointer" style={{ fontFamily: 'var(--font-heading)' }}>
            <div>
              <img
                src="/logo.png"
                alt="SkillBridge"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-medium">
              <span className="text-white">Skill</span>
              <span className="text-blue-400">Bridge</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white text-sm lg:text-base">
              Home
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white text-sm lg:text-base">
              About
            </Link>
            <button
              onClick={handleDashboard}
              className="text-gray-300 hover:text-white text-sm lg:text-base flex items-center space-x-1 hover:text-blue-400 transition-colors"
            >
              <span>Dashboard</span>
            </button>

            {!userThere ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm lg:text-base">Sign Up</span>
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-800 text-gray-300 hover:text-blue-400 px-4 py-2 rounded-lg border border-slate-700 transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm lg:text-base">Sign In</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-slate-800 hover:bg-red-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg border border-slate-700 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm lg:text-base">Logout</span>
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuIsOpen((prev) => !prev)}
          >
            {mobileMenuIsOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuIsOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
            <Link to="/" className="block text-gray-300 hover:text-white text-sm lg:text-base">
              Home
            </Link>
            <Link to="/about" className="block text-gray-300 hover:text-white text-sm lg:text-base">
              About
            </Link>
            <button
              onClick={() => {
                handleDashboard();
                setMobileMenuIsOpen(false);
              }}
              className="w-full text-left block text-gray-300 hover:text-white text-sm lg:text-base flex items-center space-x-2 hover:text-blue-400 transition-colors"
            >
              <span>Dashboard</span>
            </button>

            <div className="border-t border-slate-700 pt-4 mt-4">
              {!userThere ? (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMobileMenuIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm">Sign Up</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-blue-400 px-4 py-2 rounded-lg border border-slate-700 transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm">Sign In</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-300 text-left">{user?.name}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg border border-slate-700 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animated 3D Scroll Progress Dashes */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent overflow-hidden">
        <div className="scroll-dashes-container">
          {[...Array(20)].map((_, i) => {
            const dashThreshold = (i / 20) * 100;
            const isVisible = scrollProgress >= dashThreshold;
            return (
              <div 
                key={i} 
                className="scroll-dash"
                style={{ opacity: isVisible ? 1 : 0, pointerEvents: 'none' }}
              ></div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
