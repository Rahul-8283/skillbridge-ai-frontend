import { useEffect, useState } from "react";
import { Award, Flame, Target, Star } from "lucide-react";

export default function AchievementBadges() {
  const [badges, setBadges] = useState([]);
  const [unlockedBadges, setUnlockedBadges] = useState([]);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    // Get user's modules completion
    const completedModules =
      JSON.parse(localStorage.getItem(`${user.email}_completed_modules`)) || [];
    const learningActivities =
      JSON.parse(localStorage.getItem(`${user.email}_learning_activities`)) || {};

    // Calculate streaks and completions
    const today = new Date();
    let currentStreak = 0;
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];

      if (learningActivities[dateStr]) {
        streak++;
        if (i === 0) currentStreak = streak;
      } else {
        streak = 0;
      }
    }

    const mockBadges = [
      {
        id: 1,
        name: "Newbie",
        description: "Start your learning journey",
        icon: Star,
        color: "from-cyan-600/10 to-cyan-400/10 border-cyan-500/30",
        iconColor: "text-cyan-400",
        unlocked: true,
        requirement: 1,
        target: 1,
      },
      {
        id: 2,
        name: "10 Day Streak",
        description: "Learn for 10 consecutive days",
        icon: Flame,
        color: "from-orange-600/10 to-orange-400/10 border-orange-500/30",
        iconColor: "text-orange-400",
        unlocked: currentStreak >= 10,
        requirement: currentStreak,
        target: 10,
      },
      {
        id: 3,
        name: "20 Day Streak",
        description: "Learn for 20 consecutive days",
        icon: Flame,
        color: "from-pink-600/10 to-pink-400/10 border-pink-500/30",
        iconColor: "text-pink-400",
        unlocked: currentStreak >= 20,
        requirement: currentStreak,
        target: 20,
      },
      {
        id: 4,
        name: "30 Day Streak",
        description: "Learn for 30 consecutive days - Monthly Champion",
        icon: Flame,
        color: "from-purple-600/10 to-purple-400/10 border-purple-500/30",
        iconColor: "text-purple-400",
        unlocked: currentStreak >= 30,
        requirement: currentStreak,
        target: 30,
      },
      {
        id: 5,
        name: "50 Day Streak",
        description: "Learn for 50 consecutive days - Legend",
        icon: Award,
        color: "from-yellow-600/10 to-yellow-400/10 border-yellow-500/30",
        iconColor: "text-yellow-400",
        unlocked: currentStreak >= 50,
        requirement: currentStreak,
        target: 50,
      },
      {
        id: 6,
        name: "Topic Master",
        description: "Complete a full learning module",
        icon: Target,
        color: "from-green-600/10 to-green-400/10 border-green-500/30",
        iconColor: "text-green-400",
        unlocked: completedModules.length >= 1,
        requirement: completedModules.length,
        target: 1,
      },
    ];

    setBadges(mockBadges);
    setUnlockedBadges(mockBadges.filter((b) => b.unlocked));
  };

  const BadgeCard = ({ badge }) => {
    const Icon = badge.icon;
    const progressPercent = Math.min(
      (badge.requirement / badge.target) * 100,
      100
    );

    return (
      <div
        className={`bg-gradient-to-br ${badge.color} border rounded-2xl p-4 md:p-6 transition-all duration-300 ${
          badge.unlocked
            ? "hover:shadow-lg hover:shadow-current"
            : "opacity-60 hover:opacity-75"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className={`font-bold text-base md:text-lg ${badge.iconColor} break-words`}>
              {badge.name}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mt-1">{badge.description}</p>
          </div>
          <Icon className={`w-6 h-6 md:w-8 md:h-8 ${badge.iconColor} flex-shrink-0`} />
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Progress</span>
            <span className={`text-xs font-semibold ${badge.iconColor}`}>
              {badge.requirement}/{badge.target}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                badge.unlocked
                  ? "bg-gradient-to-r from-blue-500 to-blue-400"
                  : "bg-gradient-to-r from-gray-600 to-gray-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Badge Status */}
        <div className="mt-4 text-center">
          {badge.unlocked ? (
            <span className="inline-block px-4 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs font-semibold text-green-400">
              ✓ Unlocked
            </span>
          ) : (
            <span className="inline-block px-4 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-xs font-semibold text-gray-400">
              Locked
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="my-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <Award className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Achievements & Streaks</h2>
        </div>
        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full w-fit">
          <p className="text-sm text-blue-400">
            <span className="font-bold">{unlockedBadges.length}</span> Unlocked
          </p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>

      {/* Info Message */}
      <div className="mt-8 p-4 md:p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
        <p className="text-gray-400 text-sm">
          <span className="font-semibold text-blue-400">Pro Tip:</span> Keep
          your learning streak alive by completing topics regularly. Unlock all
          achievements by maintaining consistent daily learning habits!
        </p>
      </div>
    </div>
  );
}
