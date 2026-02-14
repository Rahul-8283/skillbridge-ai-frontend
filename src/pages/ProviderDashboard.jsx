import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Users, BarChart3, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProviderDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === "job-provider") {
        setUser(userData);
      } else {
        navigate("/seeker-dashboard");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);



  if (!user) {
    return null;
  }

  return (
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
              Role: <span className="text-blue-300">Job Provider</span>
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
            <p className="text-gray-400">Active Jobs</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-400/20 border border-purple-500/30">
            <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
            <p className="text-gray-400">Candidates</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-600/20 to-green-400/20 border border-green-500/30">
            <div className="text-3xl font-bold text-green-400 mb-2">0</div>
            <p className="text-gray-400">Matches</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-600/20 to-amber-400/20 border border-amber-500/30">
            <div className="text-3xl font-bold text-amber-400 mb-2">0</div>
            <p className="text-gray-400">Hired</p>
          </div>
        </motion.div>

        {/* Main Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Post Job */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-blue-600/10 to-blue-400/10 border border-blue-500/30 hover:border-blue-400 transition-all duration-300 cursor-pointer"
            >
              <div className="p-4 bg-blue-500/20 rounded-lg w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Post Job</h3>
              <p className="text-gray-400 mb-6">
                Create and publish a new job opportunity
              </p>
              <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300">
                Create Job
              </button>
            </motion.div>

            {/* Find Candidates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-purple-600/10 to-purple-400/10 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 cursor-pointer"
            >
              <div className="p-4 bg-purple-500/20 rounded-lg w-fit mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Find Candidates</h3>
              <p className="text-gray-400 mb-6">
                Browse and match with qualified candidates
              </p>
              <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300">
                Browse
              </button>
            </motion.div>

            {/* My Postings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-green-600/10 to-green-400/10 border border-green-500/30 hover:border-green-400 transition-all duration-300 cursor-pointer"
            >
              <div className="p-4 bg-green-500/20 rounded-lg w-fit mb-4 group-hover:bg-green-500/30 transition-colors">
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">My Postings</h3>
              <p className="text-gray-400 mb-6">
                Manage and track your active job postings
              </p>
              <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300">
                View all
              </button>
            </motion.div>
          </div>
        </div>

        {/* Recent Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-8 rounded-2xl bg-slate-900 border border-slate-700"
        >
          <h2 className="text-2xl font-bold mb-6">Recently Matched Candidates</h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">No candidates yet</p>
                <p className="text-gray-400 text-sm">Post a job to find matching candidates</p>
              </div>
              <CheckCircle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 p-6 rounded-2xl bg-blue-500/20 border border-blue-500/30"
        >
          <h3 className="text-lg font-bold text-blue-200 mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li>• Write detailed job descriptions to get better candidate matches</li>
            <li>• Use specific skills and experience requirements for accuracy</li>
            <li>• Review candidate profiles thoroughly before scheduling interviews</li>
            <li>• Respond to qualified candidates within 24 hours</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
