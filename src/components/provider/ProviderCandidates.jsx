import { motion } from "framer-motion";
import { User, Mail, MapPin, Briefcase, Check, X, Loader2 } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function ProviderCandidates({ candidates = [], onStatusUpdate }) {
  const [updating, setUpdating] = useState(null);

  const handleStatusUpdate = async (email, status) => {
    setUpdating(email);
    try {
      await api.post("/provider/update-candidate-status", { candidateEmail: email, status });
      toast.success(`Candidate ${status === 'selected' ? 'selected' : 'rejected'} successfully`);
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
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
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-white">{candidate.name}</h3>
                  <p className="text-xs text-gray-400">{candidate.email}</p>
                </div>

                {candidate.profile && (
                  <div className="hidden lg:flex items-center space-x-6 text-sm flex-[2]">
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
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleStatusUpdate(candidate.email, 'selected')}
                  disabled={updating === candidate.email}
                  className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-all"
                  title="Select Candidate"
                >
                  {updating === candidate.email ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleStatusUpdate(candidate.email, 'rejected')}
                  disabled={updating === candidate.email}
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                  title="Reject Candidate"
                >
                  {updating === candidate.email ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-white font-semibold">No candidates yet</p>
            <p className="text-gray-400 text-sm">Candidates will appear here as they join</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
