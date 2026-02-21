import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";

export default function LearningProgressTracker() {
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    maxStreak: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    // Get learning activities from localStorage
    const learningActivities =
      JSON.parse(localStorage.getItem(`${user.email}_learning_activities`)) || {};

    // Generate calendar data for past 12 months
    const today = new Date();
    const calendarData = [];
    const activityCount = {};

    // Process all months (52 weeks for year view)
    for (let i = 51; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i * 7);

      const dateStr = date.toISOString().split("T")[0];
      const count = learningActivities[dateStr] || Math.floor(Math.random() * 5); // Mock data

      calendarData.push({
        date: dateStr,
        count: count,
        weekNumber: Math.floor(i / 7),
      });

      if (count > 0) {
        activityCount[dateStr] = count;
      }
    }

    // Calculate stats
    const totalDays = Object.keys(activityCount).length;
    let maxStreak = 0;
    let currentStreak = 0;
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];

      if (activityCount[dateStr]) {
        streak++;
        if (i === 0) currentStreak = streak;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }

    setProgressData(calendarData);
    setStats({
      totalDays,
      maxStreak,
      currentStreak,
    });
  };

  const getColor = (count) => {
    if (count === 0) return "bg-slate-800";
    if (count === 1) return "bg-green-900";
    if (count === 2) return "bg-green-700";
    if (count === 3) return "bg-green-600";
    if (count === 4) return "bg-green-500";
    return "bg-green-400";
  };

  return (
    <div className="my-12">
      <div className="flex items-center space-x-3 mb-6">
        <GraduationCap className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold">Learning Progress</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-600/10 to-blue-400/10 border border-blue-500/30 rounded-2xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Active Days</p>
          <p className="text-3xl font-bold text-blue-400">{stats.totalDays}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600/10 to-green-400/10 border border-green-500/30 rounded-2xl p-4">
          <p className="text-gray-400 text-sm mb-1">Max Streak</p>
          <p className="text-3xl font-bold text-green-400">{stats.maxStreak}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600/10 to-purple-400/10 border border-purple-500/30 rounded-2xl p-4">
          <p className="text-gray-400 text-sm mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-purple-400">{stats.currentStreak}</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 overflow-x-auto">
        <div className="flex items-end space-x-1 pb-4">
          {/* Legend */}
          <div className="flex items-center space-x-2 text-xs text-gray-400 mr-8">
            <span>Less</span>
            <div className="w-3 h-3 bg-slate-800 rounded-sm" />
            <div className="w-3 h-3 bg-green-900 rounded-sm" />
            <div className="w-3 h-3 bg-green-700 rounded-sm" />
            <div className="w-3 h-3 bg-green-600 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 rounded-sm" />
            <span>More</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex flex-wrap gap-1">
          {progressData.map((day, idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-offset-2 hover:ring-blue-400 ${getColor(
                day.count
              )}`}
              title={`${day.date}: ${day.count} activities`}
            />
          ))}
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-4 text-center">
        Year of learning - Track your daily progress towards mastery
      </p>
    </div>
  );
}
