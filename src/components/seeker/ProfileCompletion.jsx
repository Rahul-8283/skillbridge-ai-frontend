import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProfileCompletion({ user }) {
  const [profileData, setProfileData] = useState({
    resume: "",
    skills: "",
    experience: "",
  });
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    if (user) {
      const storedProfile = localStorage.getItem(`${user.email}_profile`);
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setProfileData(profile);
        
        // Calculate completion percentage
        const fields = ["resume", "skills", "experience"];
        const filledFields = fields.filter((field) => profile[field] && profile[field].trim().length > 0);
        setCompletion(Math.round((filledFields.length / fields.length) * 100));
      }
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="p-8 rounded-2xl bg-slate-900 border border-slate-700"
    >
      <h2 className="text-2xl font-bold mb-6">Profile Completion</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Overall Profile</span>
          <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-blue-500 transition-all`}
              style={{ width: `${completion}%` }}
            ></div>
          </div>
          <span className="text-gray-400">{completion}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Resume</span>
          <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-blue-500`}
              style={{ width: profileData.resume ? "100%" : "0%" }}
            ></div>
          </div>
          <span className="text-gray-400">{profileData.resume ? "100%" : "0%"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Skills Added</span>
          <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-purple-500`}
              style={{ width: profileData.skills ? "100%" : "0%" }}
            ></div>
          </div>
          <span className="text-gray-400">{profileData.skills ? "100%" : "0%"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Experience</span>
          <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-green-500`}
              style={{ width: profileData.experience ? "100%" : "0%" }}
            ></div>
          </div>
          <span className="text-gray-400">{profileData.experience ? "100%" : "0%"}</span>
        </div>
      </div>
      <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <p className="text-blue-200">
          Complete your profile to get 3x more job matches and opportunities
        </p>
      </div>
    </motion.div>
  );
}
