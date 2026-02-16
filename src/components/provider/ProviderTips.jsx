import { motion } from "framer-motion";

export default function ProviderTips() {
  return (
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
  );
}
