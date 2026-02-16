import { motion } from "framer-motion";
import { FileText, Users, BarChart3 } from "lucide-react";

const colorConfig = {
  blue: {
    bg: "bg-gradient-to-br from-blue-600/10 to-blue-400/10 border border-blue-500/30 hover:border-blue-400",
    icon: "p-4 bg-blue-500/20 rounded-lg w-fit mb-4 group-hover:bg-blue-500/30",
    iconColor: "w-8 h-8 text-blue-400",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-600/10 to-purple-400/10 border border-purple-500/30 hover:border-purple-400",
    icon: "p-4 bg-purple-500/20 rounded-lg w-fit mb-4 group-hover:bg-purple-500/30",
    iconColor: "w-8 h-8 text-purple-400",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  green: {
    bg: "bg-gradient-to-br from-green-600/10 to-green-400/10 border border-green-500/30 hover:border-green-400",
    icon: "p-4 bg-green-500/20 rounded-lg w-fit mb-4 group-hover:bg-green-500/30",
    iconColor: "w-8 h-8 text-green-400",
    button: "bg-green-600 hover:bg-green-700",
  },
};

export default function ProviderActions() {
  const actions = [
    {
      title: "Post Job",
      description: "Create and publish a new job opportunity",
      icon: FileText,
      color: "blue",
      buttonText: "Create Job",
      delay: 0.2,
    },
    {
      title: "Find Candidates",
      description: "Browse and match with qualified candidates",
      icon: Users,
      color: "purple",
      buttonText: "Browse",
      delay: 0.3,
    },
    {
      title: "My Postings",
      description: "Manage and track your active job postings",
      icon: BarChart3,
      color: "green",
      buttonText: "View all",
      delay: 0.4,
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const colors = colorConfig[action.color];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: action.delay }}
              className={`group p-8 rounded-2xl ${colors.bg} transition-all duration-300 cursor-pointer`}
            >
              <div className={colors.icon}>
                <Icon className={colors.iconColor} />
              </div>
              <h3 className="text-xl font-bold mb-2">{action.title}</h3>
              <p className="text-gray-400 mb-6">{action.description}</p>
              <button
                className={`w-full py-2 px-4 ${colors.button} text-white font-semibold rounded-lg transition-all duration-300`}
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
