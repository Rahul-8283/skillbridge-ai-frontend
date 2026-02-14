import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Briefcase, BookOpen, Search, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/Footer.jsx";

export default function SeekerDashboard() {
  const [user, setUser] = useState(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === "job-seeker") {
        setUser(userData);
      } else {
        navigate("/provider-dashboard");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);



  if (!user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white px-4 pt-32 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-5xl font-bold mb-2">
              Welcome back, <span className="text-blue-400">{user.name}</span>
            </h1>
            <p className="text-gray-400">
              Role: <span className="text-blue-300">Job Seeker</span>
            </p>
          </div>


        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-400/20 border border-blue-500/30">
            <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
            <p className="text-gray-400">Applications</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-400/20 border border-purple-500/30">
            <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
            <p className="text-gray-400">Job Matches</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-600/20 to-green-400/20 border border-green-500/30">
            <div className="text-3xl font-bold text-green-400 mb-2">0%</div>
            <p className="text-gray-400">Profile Complete</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-600/20 to-amber-400/20 border border-amber-500/30">
            <div className="text-3xl font-bold text-amber-400 mb-2">0</div>
            <p className="text-gray-400">Interviews</p>
          </div>
        </motion.div>

        {/* Main Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Upload Resume */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-blue-600/10 to-blue-400/10 border border-blue-500/30 hover:border-blue-400 transition-all duration-300 cursor-pointer"
            >
              <div className="p-4 bg-blue-500/20 rounded-lg w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Upload className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Resume</h3>
              <p className="text-gray-400 mb-6">
                Upload your resume for AI-powered analysis and matching
              </p>
              <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300">
                Upload
              </button>
            </motion.div>

            {/* Browse Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-purple-600/10 to-purple-400/10 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 cursor-pointer"
            >
              <div className="p-4 bg-purple-500/20 rounded-lg w-fit mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Briefcase className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Browse Jobs</h3>
              <p className="text-gray-400 mb-6">
                Discover perfectly matched job opportunities
              </p>
              <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300">
                Explore
              </button>
            </motion.div>

            {/* Learning Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-green-600/10 to-green-400/10 border border-green-500/30 hover:border-green-400 transition-all duration-300 cursor-pointer"
            >
              <div className="p-4 bg-green-500/20 rounded-lg w-fit mb-4 group-hover:bg-green-500/30 transition-colors">
                <BookOpen className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Learning Plan</h3>
              <p className="text-gray-400 mb-6">
                Get personalized skill development recommendations
              </p>
              <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300">
                View Plan
              </button>
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-8 rounded-2xl bg-slate-900 border border-slate-700"
        >
          <h2 className="text-2xl font-bold mb-6">Profile Completion</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Resume</span>
              <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-0"></div>
              </div>
              <span className="text-gray-400">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Skills Added</span>
              <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-0"></div>
              </div>
              <span className="text-gray-400">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Experience</span>
              <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-0"></div>
              </div>
              <span className="text-gray-400">0%</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-200">
              Complete your profile to get 3x more job matches and opportunities
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );
}
