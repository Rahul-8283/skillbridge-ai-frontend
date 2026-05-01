import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCircle, Briefcase, ChevronRight } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import api from "../utils/api";
import { toast } from "react-toastify";

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If not logged in, go back to login
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
    // If already has a valid role, why are they here? Drop them at dashboard.
    else if (user?.role !== "pending") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  const handleRoleSelection = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    try {
      // Must await for the setRole api which should return updated token/user
      const response = await api.post("/auth/set-role", { role: selectedRole });
      
      const updatedUser = response.user || response.data?.user || response;
      const newToken = response.accessToken || response.data?.accessToken || token;

      // Update LocalStorage
      localStorage.setItem("access_token", newToken);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update Zustand Store
      useAuthStore.setState({ user: updatedUser, token: newToken, isAuthenticated: true });

      toast.success(`Welcome to SkillBridge, ${updatedUser.name}!`);
      
      // Use replace so they can't 'go back' to role selection
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Failed to set role", error);
      toast.error(error?.response?.data?.message || "An error occurred setting your role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full space-y-8 text-center"
      >
        <div>
          <h2 className="mt-6 text-4xl font-extrabold text-white tracking-tight">
            How do you want to use SkillBridge?
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Tell us about your goals so we can customize your experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {/* Seeker Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer rounded-2xl border-2 p-8 transition-all duration-200 ${
              selectedRole === 'seeker' 
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
            }`}
            onClick={() => setSelectedRole('seeker')}
          >
            <div className="flex flex-col items-center">
              <div className={`p-4 rounded-full mb-4 ${selectedRole === 'seeker' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                <UserCircle className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Job Seeker</h3>
              <p className="text-slate-400 text-center text-sm flex-grow">
                I am looking for new opportunities, want to upload my resume, and discover AI-powered learning paths to improve my skills.
              </p>
              
              <div className={`mt-6 w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedRole === 'seeker' ? 'border-blue-500 border-4' : 'border-slate-600'}`}>
                {selectedRole === 'seeker' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
              </div>
            </div>
          </motion.div>

          {/* Provider Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer rounded-2xl border-2 p-8 transition-all duration-200 ${
              selectedRole === 'provider' 
                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20' 
                : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
            }`}
            onClick={() => setSelectedRole('provider')}
          >
            <div className="flex flex-col items-center">
              <div className={`p-4 rounded-full mb-4 ${selectedRole === 'provider' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                <Briefcase className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Job Provider</h3>
              <p className="text-slate-400 text-center text-sm flex-grow">
                I represent a company looking to post job openings, manage applicants, and find the best verified candidates.
              </p>

              <div className={`mt-6 w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedRole === 'provider' ? 'border-emerald-500 border-4' : 'border-slate-600'}`}>
                {selectedRole === 'provider' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.button
          disabled={!selectedRole || isLoading}
          whileHover={selectedRole && !isLoading ? { scale: 1.05 } : {}}
          whileTap={selectedRole && !isLoading ? { scale: 0.95 } : {}}
          onClick={handleRoleSelection}
          className={`mt-10 px-8 py-3 rounded-full font-bold text-lg flex items-center justify-center w-full max-w-md mx-auto transition-all ${
            selectedRole && !isLoading
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-xl'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
          ) : null}
          Continue to Dashboard <ChevronRight className="ml-2 w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RoleSelectionPage;