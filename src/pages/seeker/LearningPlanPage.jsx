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

const FALLBACK_SUMMARY_MARKER = "Summary not available yet";
const FALLBACK_TOPICS = [
  "learn the absolute basics",
  "review documentation and core concepts",
  "complete a portfolio project",
];

const normalizeTopicForCompare = (topic) =>
  topic
    .toString()
    .toLowerCase()
    .replace(/^\s*[-*\d.]+\s*/, "")
    .trim();

const hasFallbackTopics = (topics) => {
  if (!Array.isArray(topics) || topics.length !== 3) return false;
  const normalized = topics.map(normalizeTopicForCompare);
  return FALLBACK_TOPICS.every((fallback) => normalized.includes(fallback));
};

export default function LearningPlanPage() {
  const navigate = useNavigate();
  const { currentPlan, learningPlans, isLoading, generateLearningPlan } = useLearning();
  const [learningPlan, setLearningPlan] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenError, setRegenError] = useState(null);

  const normalizeTopics = (topicInput) => {
    if (Array.isArray(topicInput)) {
      return topicInput
        .map((topic) => {
          if (typeof topic === "string") return topic.trim();
          if (topic && typeof topic === "object") {
            return (
              topic.step ||
              topic.title ||
              topic.description ||
              topic.text ||
              ""
            )
              .toString()
              .trim();
          }
          return "";
        })
        .filter(Boolean);
    }

    if (typeof topicInput === "string") {
      return topicInput
        .split(/\r?\n+/)
        .map((line) => line.replace(/^\s*[-*\d.]+\s*/, "").trim())
        .filter(Boolean);
    }

    return [];
  };

  const normalizeModuleResources = (skill) => {
    const youtubeItems = Array.isArray(skill.youtube) ? skill.youtube : [];
    const directResources = Array.isArray(skill.resources) ? skill.resources : [];

    // Get YouTube URL - prioritize youtube_url field from backend
    const tutorialUrl =
      skill.youtube_url ||
      skill.video_url ||
      skill.videoUrl ||
      skill.youtubeUrl ||
      youtubeItems[0]?.url ||
      null;

    // Normalize all resource links with proper structure
    const normalizedResourceLinks = directResources
      .map((resource) => {
        if (!resource || typeof resource !== "object") return null;
        return {
          title: resource.title || resource.label || resource.name || "Open Resource",
          url: resource.url || resource.link || resource.href || null,
          stars: resource.stars || null,
          language: resource.language || null,
          description: resource.description || null
        };
      })
      .filter((resource) => resource?.url);

    return {
      tutorialUrl,
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
        jobId: roadmap.jobId || roadmap.job_id || null,
        hoursPerDay: roadmap.hoursPerDay || roadmap.hours_per_day || 2,
        targetRole: roadmap.targetRole || `Learning Path`,
        completionTime: roadmap.overallDays ? `${Math.round(roadmap.overallDays)} days` : (roadmap.overall_days ? `${Math.round(roadmap.overall_days)} days` : "Unknown"),
        modules: Array.isArray(roadmap.skills)
          ? roadmap.skills.map((skill, index) => {
              const normalizedResources = normalizeModuleResources(skill);
              const normalizedTopics = normalizeTopics(
                skill.roadmap ||
                  skill.roadmap_steps ||
                  skill.steps ||
                  skill.curriculum_topics ||
                  skill.learning_path
              );

              const normalizedDurationDays = Number(
                skill.total_days ??
                  skill.duration_days ??
                  skill.days ??
                  skill.estimated_days ??
                  0
              );

              const summaryText =
                skill.summary ||
                skill.description ||
                skill.overview ||
                skill.plan_summary ||
                "Guided steps to learn this skill.";

              const isFallbackModule =
                summaryText.includes(FALLBACK_SUMMARY_MARKER) ||
                hasFallbackTopics(normalizedTopics);

              return {
                id: index + 1,
                title: skill.skill || skill.keyword || skill.name || `Module ${index + 1}`,
                duration: Number.isFinite(normalizedDurationDays)
                  ? `${normalizedDurationDays.toFixed(2)} days`
                  : "Unknown",
                lessons: normalizedTopics.length,
                stepTimeDays: Array.isArray(skill.step_time_days) ? skill.step_time_days : [],
                summary: summaryText,
                difficulty: "intermediate",
                topics: normalizedTopics,
                isFallback: isFallbackModule,
                ...normalizedResources,
              };
            })
          : []
      };

      mappedPlan.isFallback = mappedPlan.modules.some((module) => module.isFallback);
      setLearningPlan(mappedPlan);
      setCompletedModules(Array.isArray(roadmap.completedModules) ? roadmap.completedModules : []);
    }
  }, [currentPlan, learningPlans]);

  const handleRegeneratePlan = async () => {
    if (!learningPlan?.jobId) return;
    setRegenError(null);
    setIsRegenerating(true);

    try {
      const result = await generateLearningPlan(learningPlan.jobId, learningPlan.hoursPerDay || 2);
      if (!result?.success) {
        throw new Error(result?.error || "Failed to regenerate learning plan");
      }
    } catch (err) {
      setRegenError(err?.message || "Failed to regenerate learning plan");
    } finally {
      setIsRegenerating(false);
    }
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
            <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
              {module.summary.split('\n').map((line, idx) => (
                <div key={idx}>
                  {line.split(/(\*\*.*?\*\*)/g).map((part, i) => 
                    part.startsWith('**') && part.endsWith('**') 
                      ? <span key={i} className="font-bold text-white">{part.slice(2, -2)}</span>
                      : part
                  )}
                </div>
              ))}
            </div>
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
            {module.tutorialUrl && (
              <a
                href={module.tutorialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 hover:bg-red-500/20 transition-all font-semibold group"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>YouTube Tutorial</span>
              </a>
            )}
            {module.resourceLinks
              .filter((resource) => resource?.url)
              .map((resource, idx) => {
                const isGithub = resource.url?.includes('github.com');
                return (
                  <div key={`${module.id}-resource-${idx}`} className="group relative">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isGithub
                          ? 'bg-gray-700/20 border border-gray-500/30 text-gray-300 hover:bg-gray-600/30 hover:border-gray-400/50'
                          : 'bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20'
                      }`}
                    >
                      {isGithub ? (
                        <>
                          <span>🔗 {resource.title || resource.name}</span>
                          {resource.stars && <span className="text-yellow-300">⭐{resource.stars}</span>}
                        </>
                      ) : (
                        <span>📚 {resource.title || "Open Resource"}</span>
                      )}
                    </a>
                    {resource.description && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-50 hidden group-hover:block bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-gray-300 w-48">
                        {resource.description.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                );
              })}
            {!module.tutorialUrl && module.resourceLinks.length === 0 && (
              <span className="text-gray-500 text-xs italic">Service did not return external links for this skill</span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-widest">📚 Curriculum & Timeline</p>
          {module.topics.length > 0 ? (
            <div className="space-y-2">
              {module.topics.map((topic, index) => {
                const days = module.stepTimeDays[index] ? Number(module.stepTimeDays[index]).toFixed(1) : "N/A";
                return (
                  <div
                    key={`${module.id}-topic-${index}`}
                    className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500/10 to-orange-400/5 border border-orange-500/30 hover:border-orange-400/50 rounded-lg group transition-all duration-300"
                  >
                    <span className="text-orange-300 font-semibold text-sm group-hover:text-orange-200">{topic}</span>
                    <span className="text-orange-400 font-bold text-sm bg-orange-500/20 px-3 py-1 rounded-full">{days} days</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="text-gray-500 text-xs italic">No curriculum steps provided</span>
          )}
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
            onClick={() => navigate("/dashboard/browse-jobs")}
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
            onClick={() => navigate("/dashboard")}
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

      {learningPlan.isFallback && (
        <div className="px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-6xl mx-auto py-6">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-amber-300 font-semibold">Roadmap is using placeholder content</p>
                <p className="text-amber-200/80 text-sm">
                  The AI service returned fallback steps. Regenerate the plan to fetch the full roadmap.
                </p>
                {regenError && (
                  <p className="text-xs text-red-300 mt-2">{regenError}</p>
                )}
              </div>
              <button
                onClick={handleRegeneratePlan}
                disabled={isRegenerating}
                className="px-5 py-2 rounded-lg font-semibold bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30 disabled:opacity-60"
              >
                {isRegenerating ? "Regenerating..." : "Regenerate Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

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
