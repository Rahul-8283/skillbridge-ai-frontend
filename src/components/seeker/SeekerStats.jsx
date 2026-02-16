import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

export default function SeekerStats({ user }) {
  const [profileCompletion, setProfileCompletion] = useState("0%");

  useEffect(() => {
    if (user) {
      const storedProfile = localStorage.getItem(`${user.email}_profile`);
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        const fields = ["resume", "skills", "experience"];
        const filledFields = fields.filter((field) => profile[field] && profile[field].trim().length > 0);
        const completion = Math.round((filledFields.length / fields.length) * 100);
        setProfileCompletion(`${completion}%`);
      }
    }
  }, [user]);

  const stats = [
    { label: "Applications", value: "0", color: "blue" },
    { label: "Job Matches", value: "0", color: "purple" },
    { label: "Profile Complete", value: profileCompletion, color: "green" },
    { label: "Interviews", value: "0", color: "amber" },
  ];

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
