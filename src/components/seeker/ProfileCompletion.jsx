import { motion } from "framer-motion";

export default function ProfileCompletion() {
  const profileItems = [
    { label: "Resume", color: "blue", percentage: 0 },
    { label: "Skills Added", color: "purple", percentage: 0 },
    { label: "Experience", color: "green", percentage: 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="p-8 rounded-2xl bg-slate-900 border border-slate-700"
    >
      <h2 className="text-2xl font-bold mb-6">Profile Completion</h2>
      <div className="space-y-4">
        {profileItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-300">{item.label}</span>
            <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-${item.color}-500 w-${item.percentage}`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <span className="text-gray-400">{item.percentage}%</span>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <p className="text-blue-200">
          Complete your profile to get 3x more job matches and opportunities
        </p>
      </div>
    </motion.div>
  );
}
