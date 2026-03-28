import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const colorStyles = {
  blue: "from-blue-600/20 to-blue-400/20 border-blue-500/30",
  purple: "from-purple-600/20 to-purple-400/20 border-purple-500/30",
  green: "from-green-600/20 to-green-400/20 border-green-500/30",
  amber: "from-amber-600/20 to-amber-400/20 border-amber-500/30",
};

const textColorMap = {
  blue: "text-blue-400",
  purple: "text-purple-400",
  green: "text-green-400",
  amber: "text-amber-400",
};

export default function ProviderStats() {
  const [stats, setStats] = useState([
    { label: "Active Jobs", value: "0", color: "blue" },
    { label: "Candidates", value: "0", color: "purple" },
    { label: "Matches", value: "0", color: "green" },
    { label: "Hired", value: "0", color: "amber" },
  ]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    // Count active jobs posted by current provider
    const allPostings = JSON.parse(localStorage.getItem("jobPostings")) || [];
    const activeJobs = allPostings.filter(
      (job) => job.postedBy === user.email && job.status === "active"
    ).length;

    // Count total candidates (job seekers)
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const totalCandidates = registeredUsers.filter(
      (u) => u.role === "seeker"
    ).length;

    // Count hired candidates for this provider
    const hiredCandidates = JSON.parse(localStorage.getItem("hiredCandidates")) || [];
    const hiredCount = hiredCandidates.filter(
      (hire) => hire.providerId === user.email
    ).length;

    setStats([
      { label: "Active Jobs", value: activeJobs.toString(), color: "blue" },
      { label: "Candidates", value: totalCandidates.toString(), color: "purple" },
      { label: "Matches", value: "0", color: "green" },
      { label: "Hired", value: hiredCount.toString(), color: "amber" },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid md:grid-cols-4 gap-6 mb-12"
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-6 rounded-2xl bg-gradient-to-br ${colorStyles[stat.color]} border`}
        >
          <div className={`text-3xl font-bold ${textColorMap[stat.color]} mb-2`}>
            {stat.value}
          </div>
          <p className="text-gray-400">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
