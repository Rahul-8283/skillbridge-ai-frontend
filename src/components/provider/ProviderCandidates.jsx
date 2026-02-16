import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function ProviderCandidates() {
  return (
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
  );
}
