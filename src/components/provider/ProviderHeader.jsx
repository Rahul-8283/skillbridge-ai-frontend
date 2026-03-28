import { motion } from "framer-motion";

export default function ProviderHeader({ user, profile }) {
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
        {profile?.companyName && (
          <p className="text-xl text-blue-300/80 mb-2 font-semibold">
            {profile.companyName}
          </p>
        )}
        <p className="text-gray-400">
          Role: <span className="text-blue-300">Job Provider</span>
        </p>
      </div>
    </motion.div>
  );
}
