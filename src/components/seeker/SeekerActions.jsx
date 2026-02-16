import { motion } from "framer-motion";
import { Upload, Briefcase, BookOpen } from "lucide-react";

export default function SeekerActions() {
  const actions = [
    {
      title: "Upload Resume",
      description: "Upload your resume for AI-powered analysis and matching",
      icon: Upload,
      color: "blue",
      buttonText: "Upload",
      delay: 0.2,
    },
    {
      title: "Browse Jobs",
      description: "Discover perfectly matched job opportunities",
      icon: Briefcase,
      color: "purple",
      buttonText: "Explore",
      delay: 0.3,
    },
    {
      title: "Learning Plan",
      description: "Get personalized skill development recommendations",
      icon: BookOpen,
      color: "green",
      buttonText: "View Plan",
      delay: 0.4,
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: action.delay }}
              className={`group p-8 rounded-2xl bg-gradient-to-br from-${action.color}-600/10 to-${action.color}-400/10 border border-${action.color}-500/30 hover:border-${action.color}-400 transition-all duration-300 cursor-pointer`}
            >
              <div
                className={`p-4 bg-${action.color}-500/20 rounded-lg w-fit mb-4 group-hover:bg-${action.color}-500/30 transition-colors`}
              >
                <Icon className={`w-8 h-8 text-${action.color}-400`} />
              </div>
              <h3 className="text-xl font-bold mb-2">{action.title}</h3>
              <p className="text-gray-400 mb-6">{action.description}</p>
              <button
                className={`w-full py-2 px-4 bg-${action.color}-600 hover:bg-${action.color}-700 text-white font-semibold rounded-lg transition-all duration-300`}
              >
                {action.buttonText}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
