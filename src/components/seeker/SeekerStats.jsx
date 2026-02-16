import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
          className={`p-6 rounded-2xl bg-gradient-to-br from-${stat.color}-600/20 to-${stat.color}-400/20 border border-${stat.color}-500/30`}
        >
          <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>
            {stat.value}
          </div>
          <p className="text-gray-400">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
