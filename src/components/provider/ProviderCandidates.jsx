import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { User, Mail, MapPin, Briefcase, GraduationCap } from "lucide-react";

export default function ProviderCandidates() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = () => {
    // Get all registered users who are job seekers
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const seekers = registeredUsers.filter((u) => u.role === "job-seeker");

    // Enrich with profile data
    const enrichedCandidates = seekers.map((seeker) => {
      const profileKey = `${seeker.email}_profile`;
      const profile = JSON.parse(localStorage.getItem(profileKey)) || {};
      return {
        ...seeker,
        profile,
      };
    });

    setCandidates(enrichedCandidates);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="p-8 rounded-2xl bg-slate-900 border border-slate-700"
    >
      <h2 className="text-2xl font-bold mb-6">Recently Matched Candidates</h2>
      <div className="space-y-3">
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div
              key={candidate.email}
              className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-blue-500/50 transition-all flex items-center justify-between"
            >
              {/* Left side - Candidate Info */}
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{candidate.name}</h3>
                  <p className="text-xs text-gray-400">{candidate.email}</p>
                </div>

                {/* Profile Details */}
                {candidate.profile && (
                  <div className="flex items-center space-x-6 text-sm">
                    {candidate.profile.location && (
                      <div className="flex items-center space-x-1 text-gray-300">
                        <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{candidate.profile.location}</span>
                      </div>
                    )}

                    {candidate.profile.experience && (
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Briefcase className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span>{candidate.profile.experience}</span>
                      </div>
                    )}

                    {/* Skills Preview */}
                    {candidate.profile.skills && (
                      <div className="flex items-center space-x-2">
                        {candidate.profile.skills
                          .split(",")
                          .slice(0, 2)
                          .map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-blue-600/20 border border-blue-500/30 rounded text-blue-300 whitespace-nowrap"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        {candidate.profile.skills.split(",").length > 2 && (
                          <span className="text-xs text-gray-400 ml-1">
                            +{candidate.profile.skills.split(",").length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">No candidates yet</p>
              <p className="text-gray-400 text-sm">Candidates will appear here as they join</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
