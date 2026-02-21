import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import {
  fetchLearningActivities,
  generateMonthlyCalendars,
  getContributionColor,
} from "../../utils/learningActivityUtils.js";

export default function LearningProgressTracker() {
  const [monthlyGrids, setMonthlyGrids] = useState([]);
  const [stats, setStats] = useState({
    totalContributions: 0,
    maxStreak: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    generateCalendar();
  }, []);

  const generateCalendar = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const activities = fetchLearningActivities(user.email);
    const { monthlyGrids: grids, stats: calculatedStats } = generateMonthlyCalendars(activities);

    setMonthlyGrids(grids);
    setStats(calculatedStats);
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (monthlyGrids.length === 0) {
    return (
      <div className="my-12 p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center">
        <p className="text-gray-400">Loading learning progress...</p>
      </div>
    );
  }

  return (
    <div className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <GraduationCap className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">
            {stats.totalContributions} Learnings in the last year
          </h2>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-600/10 to-blue-400/10 border border-blue-500/30 rounded-2xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Learnings</p>
          <p className="text-3xl font-bold text-blue-400">
            {stats.totalContributions}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-600/10 to-green-400/10 border border-green-500/30 rounded-2xl p-4">
          <p className="text-gray-400 text-sm mb-1">Max Streak</p>
          <p className="text-3xl font-bold text-green-400">{stats.maxStreak}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600/10 to-purple-400/10 border border-purple-500/30 rounded-2xl p-4">
          <p className="text-gray-400 text-sm mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-purple-400">
            {stats.currentStreak}
          </p>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 overflow-hidden">
        <div className="flex gap-3">
          {/* Day Labels - Fixed on Left */}
          <div className="flex flex-col">
            {/* Spacer for month label area */}
            <div className="h-5 mb-0.5" />
            {/* Day labels */}
            {dayLabels.map((day, idx) => (
              <div
                key={idx}
                className="text-xs text-gray-500 font-medium"
                style={{ height: "16px", lineHeight: "19px", marginBottom: "2px" }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* All Months in One Row */}
          <div className="flex gap-5">
            {monthlyGrids.map((monthData, idx) => (
              <div key={idx} className="flex flex-col">
                {/* Month Label */}
                <div className="text-xs font-semibold text-gray-300 h-5 flex items-center justify-center mb-2">
                  {monthData.monthName}
                </div>

                {/* Month Calendar Grid */}
                <div className="flex gap-1">
                  {monthData.grid[0] &&
                    monthData.grid[0].map((_, weekIdx) => (
                      <div key={`week-${weekIdx}`} className="flex flex-col gap-1">
                        {monthData.grid.map((_, dayIdx) => {
                          const cell = monthData.grid[dayIdx][weekIdx];
                          return (
                            <div
                              key={`${weekIdx}-${dayIdx}`}
                              className={`w-[12.6px] h-[13.1px] rounded-xs cursor-pointer transition-all duration-200 ${
                                cell
                                  ? getContributionColor(cell.count || 0)
                                  : "bg-transparent"
                              }`}
                              title={
                                cell && cell.day
                                  ? `${cell.displayDate}: ${cell.count} contributions`
                                  : ""
                              }
                            />
                          );
                        })}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-gray-500 text-sm">
          Your learning Streak ...
        </p>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-400">Less</span>
          <div className="w-3 h-3 bg-slate-800 rounded-sm" />
          <div className="w-3 h-3 bg-green-900 rounded-sm" />
          <div className="w-3 h-3 bg-green-700 rounded-sm" />
          <div className="w-3 h-3 bg-green-600 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 rounded-sm" />
          <span className="text-xs text-gray-400">More</span>
        </div>
      </div>
    </div>
  );
}
