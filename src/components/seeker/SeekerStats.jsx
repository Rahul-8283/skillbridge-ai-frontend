import { motion } from "framer-motion";

export default function SeekerStats() {
  const stats = [
    { label: "Applications", value: "0", color: "blue" },
    { label: "Job Matches", value: "0", color: "purple" },
    { label: "Profile Complete", value: "0%", color: "green" },
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
