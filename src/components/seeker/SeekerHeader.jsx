import { motion } from "framer-motion";

export default function SeekerHeader({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-between items-center mb-12"
    >
      <div>
        <h1 className="text-5xl font-bold mb-2">
          Welcome back, <span className="text-blue-400">{user.name}</span>
        </h1>
        <p className="text-gray-400">
          Role: <span className="text-blue-300">Job Seeker</span>
        </p>
      </div>
    </motion.div>
  );
}
