import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  TargetIcon,
  TrendingUp,
  Clock,
} from "lucide-react";
import Footer from "../../components/Footer";

export default function LearningPlanPage() {
  const navigate = useNavigate();
  const [learningPlan, setLearningPlan] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);

  useEffect(() => {
    loadLearningPlan();
  }, []);

  const loadLearningPlan = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    // Load completed modules
    const completed =
      JSON.parse(localStorage.getItem(`${user.email}_completed_modules`)) || [];
    setCompletedModules(completed);

    // Create personalized learning plan based on profile
    const profileKey = `${user.email}_profile`;
    const profile = JSON.parse(localStorage.getItem(profileKey)) || {};

    const mockPlan = {
      currentLevel: profile.experienceLevel || "intermediate",
      targetRole: profile.preferredRole || "Full Stack Developer",
      completionTime: "12 weeks",
      modules: [
        {
          id: 1,
          title: "JavaScript Advanced Concepts",
          duration: "2 weeks",
          lessons: 12,
          description: "Master closures, async/await, and modern JS features",
          difficulty: "intermediate",
          topics: ["Closures", "Promises", "Async/Await", "Generators"],
        },
        {
          id: 2,
          title: "React Deep Dive",
          duration: "3 weeks",
          lessons: 18,
          description: "Advanced React patterns and performance optimization",
          difficulty: "intermediate",
          topics: ["Hooks", "Context API", "Performance", "State Management"],
        },
        {
          id: 3,
          title: "Node.js & Express Backend",
          duration: "3 weeks",
          lessons: 15,
          description: "Build scalable server-side applications",
          difficulty: "intermediate",
          topics: ["Express", "Middleware", "REST APIs", "Authentication"],
        },
        {
          id: 4,
          title: "Database Design & SQL",
          duration: "2 weeks",
          lessons: 14,
          description: "SQL optimization and database design patterns",
          difficulty: "intermediate",
          topics: ["SQL Queries", "Indexes", "Transactions", "Performance"],
        },
        {
          id: 5,
          title: "System Design",
          duration: "2 weeks",
          lessons: 10,
          description: "Design scalable systems for production",
          difficulty: "advanced",
          topics: ["Architecture", "Scalability", "Caching", "Microservices"],
        },
        {
          id: 6,
          title: "DevOps & Deployment",
          duration: "2 weeks",
          lessons: 11,
          description: "CI/CD pipelines and cloud deployment",
          difficulty: "advanced",
          topics: ["Docker", "Kubernetes", "CI/CD", "AWS/GCP"],
        },
      ],
    };

    setLearningPlan(mockPlan);
  };

  const toggleModuleComplete = (moduleId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    let newCompleted;
    if (completedModules.includes(moduleId)) {
      newCompleted = completedModules.filter((id) => id !== moduleId);
    } else {
      newCompleted = [...completedModules, moduleId];
    }

    setCompletedModules(newCompleted);
    localStorage.setItem(
      `${user.email}_completed_modules`,
      JSON.stringify(newCompleted)
    );
  };

  const ModuleCard = ({ module }) => {
    const isCompleted = completedModules.includes(module.id);

    return (
      <div
        className={`rounded-2xl p-6 border transition-all duration-300 ${
          isCompleted
            ? "bg-green-500/5 border-green-500/30"
            : "bg-slate-900 border-slate-800 hover:border-blue-500/50"
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-bold text-white">{module.title}</h3>
              {isCompleted && (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-gray-400 text-sm">{module.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-slate-700">
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{module.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">{module.lessons} lessons</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-400 text-sm font-semibold mb-2">Topics:</p>
          <div className="flex flex-wrap gap-2">
            {module.topics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-400"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => toggleModuleComplete(module.id)}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
            isCompleted
              ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isCompleted ? "✓ Completed" : "Start Learning"}
        </button>
      </div>
    );
  };

  if (!learningPlan) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your learning plan...</p>
        </div>
      </div>
    );
  }

  const completionPercentage = Math.round(
    (completedModules.length / learningPlan.modules.length) * 100
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/seeker-dashboard")}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold mb-2">Your Learning Plan</h1>
          <p className="text-gray-400">
            Personalized skill development recommendations tailored for your growth
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Current Level */}
            <div className="bg-gradient-to-br from-blue-600/10 to-blue-400/10 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TargetIcon className="w-6 h-6 text-blue-400" />
                <h3 className="font-semibold text-gray-300">Current Level</h3>
              </div>
              <p className="text-3xl font-bold text-blue-400 capitalize">
                {learningPlan.currentLevel}
              </p>
            </div>

            {/* Target Role */}
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-400/10 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold text-gray-300">Target Role</h3>
              </div>
              <p className="text-xl font-bold text-purple-400">
                {learningPlan.targetRole}
              </p>
            </div>

            {/* Completion */}
            <div className="bg-gradient-to-br from-green-600/10 to-green-400/10 border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="font-semibold text-gray-300">Progress</h3>
              </div>
              <p className="text-3xl font-bold text-green-400">
                {completionPercentage}%
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {completedModules.length}/{learningPlan.modules.length} modules
              </p>
            </div>

            {/* Duration */}
            <div className="bg-gradient-to-br from-orange-600/10 to-orange-400/10 border border-orange-500/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-orange-400" />
                <h3 className="font-semibold text-gray-300">Duration</h3>
              </div>
              <p className="text-2xl font-bold text-orange-400">
                {learningPlan.completionTime}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 font-semibold">Overall Progress</span>
              <span className="text-gray-400 text-sm">
                {completedModules.length}/{learningPlan.modules.length}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Learning Modules */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {learningPlan.modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
