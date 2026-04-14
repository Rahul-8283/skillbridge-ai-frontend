import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trackLearningActivity } from "../../utils/learningActivityUtils.js";
import { useLearning } from "../../hooks/useLearning";
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
  const { currentPlan, learningPlans, isLoading } = useLearning();
  const [learningPlan, setLearningPlan] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);

  const normalizeModuleResources = (skill) => {
    const youtubeItems = Array.isArray(skill.youtube) ? skill.youtube : [];
    const githubItems = Array.isArray(skill.github) ? skill.github : [];
    const directResources = Array.isArray(skill.resources) ? skill.resources : [];

    const videoUrl =
      skill.youtube_url ||
      skill.video_url ||
      skill.videoUrl ||
      skill.youtubeUrl ||
      youtubeItems[0]?.url ||
      null;

    const githubUrl =
      skill.github_url ||
      skill.githubUrl ||
      skill.github_repo_url ||
      githubItems[0]?.url ||
      githubItems[0]?.html_url ||
      null;

    const githubRepos = Array.isArray(skill.github_repos)
      ? skill.github_repos
      : githubItems;

    const normalizedResourceLinks = directResources
      .map((resource) => {
        if (!resource || typeof resource !== "object") return null;
        return {
          title: resource.title || resource.label || resource.name || "Open Resource",
          url: resource.url || resource.link || resource.href || null,
        };
      })
      .filter((resource) => resource?.url);

    return {
      videoUrl,
      githubUrl,
      githubRepos,
      resourceLinks: normalizedResourceLinks,
    };
  };

  useEffect(() => {
    // If we have a currentPlan (freshly generated), use it.
    // Otherwise, find the latest plan from the user's list.
    const activePlan = currentPlan || (learningPlans && learningPlans.length > 0 ? learningPlans[0] : null);

    if (activePlan) {
      const roadmap = activePlan;
      const mappedPlan = {
        currentLevel: "Beginner",
        targetRole: roadmap.targetRole || `Learning Path`,
        completionTime: roadmap.overallDays ? `${Math.round(roadmap.overallDays)} days` : (roadmap.overall_days ? `${Math.round(roadmap.overall_days)} days` : "Unknown"),
        modules: Array.isArray(roadmap.skills)
          ? roadmap.skills.map((skill, index) => {
              const normalizedResources = normalizeModuleResources(skill);
              return {
                id: index + 1,
                title: skill.skill || skill.keyword || skill.name || `Module ${index + 1}`,
                duration: Number.isFinite(Number(skill.total_days))
                  ? `${Number(skill.total_days).toFixed(2)} days`
                  : "Unknown",
                lessons: Array.isArray(skill.roadmap) ? skill.roadmap.length : 0,
                summary: skill.summary || "Guided steps to learn this skill.",
                difficulty: "intermediate",
                topics: Array.isArray(skill.roadmap) ? skill.roadmap : [],
                ...normalizedResources,
              };
            })
          : []
      };
      setLearningPlan(mappedPlan);
      setCompletedModules(Array.isArray(roadmap.completedModules) ? roadmap.completedModules : []);
    }
  }, [currentPlan, learningPlans]);

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
    // Track learning activity
    trackLearningActivity(user.email);
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
            <p className="text-gray-400 text-sm">{module.summary}</p>
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

        <div className="mb-6">
          <p className="text-gray-400 text-sm font-semibold mb-3">Resources:</p>
          <div className="flex flex-wrap gap-3">
            {module.videoUrl && (
              <a
                href={module.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 hover:bg-red-500/20 transition-all font-semibold"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Watch Tutorial</span>
              </a>
            )}
            {module.githubUrl && (
              <a
                href={module.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-gray-300 hover:bg-slate-700 transition-all font-semibold"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span>GitHub Repo</span>
              </a>
            )}
            {module.githubRepos
              .filter((repo) => repo?.url || repo?.html_url)
              .slice(0, 2)
              .map((repo, idx) => (
                <a
                  key={`${module.id}-repo-${idx}`}
                  href={repo.url || repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-gray-300 hover:bg-slate-700 transition-all font-semibold"
                >
                  <span>{repo.name || repo.full_name || "Open Repo"}</span>
                </a>
              ))}
            {module.resourceLinks
              .filter((resource) => resource?.url)
              .slice(0, 2)
              .map((resource, idx) => (
                <a
                  key={`${module.id}-resource-${idx}`}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-300 hover:bg-blue-500/20 transition-all font-semibold"
                >
                  <span>{resource.title || resource.label || "Open Resource"}</span>
                </a>
              ))}
            {!module.videoUrl && !module.githubUrl && module.githubRepos.length === 0 && module.resourceLinks.length === 0 && (
              <span className="text-gray-500 text-xs italic">No external resource links provided</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-400 text-sm font-semibold mb-2">Curriculum Topics:</p>
          <div className="flex flex-wrap gap-2">
            {module.topics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-500/5 border border-blue-500/20 rounded-full text-[10px] text-blue-300"
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Fetching your AI learning plan...</p>
        </div>
      </div>
    );
  }

  if (!learningPlan || !learningPlan.modules || learningPlan.modules.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pb-20">
        <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Learning Plan Found</h2>
          <p className="text-gray-400 mb-8">
            You haven't generated an AI learning roadmap yet. Find a job that interests you and we'll create a custom path for you!
          </p>
          <button
            onClick={() => navigate("/seeker-dashboard/browse-jobs")}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
          >
            Browse Jobs to Start
          </button>
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
