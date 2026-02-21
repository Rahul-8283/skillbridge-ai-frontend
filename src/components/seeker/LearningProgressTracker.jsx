import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import {
  fetchLearningActivities,
  generateCalendarGrid,
  getContributionColor,
} from "../../utils/learningActivityUtils.js";

export default function LearningProgressTracker() {
  const [calendarGrid, setCalendarGrid] = useState([]);
  const [months, setMonths] = useState([]);
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
    const { grid, months: monthLabels, stats: calculatedStats } =
      generateCalendarGrid(activities);

    setCalendarGrid(grid);
    setMonths(monthLabels);
    setStats(calculatedStats);
  };

  const dayLabels = ["Mon", "Wed", "Fri"];

  if (calendarGrid.length === 0) {
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
            {stats.totalContributions} contributions in the last year
          </h2>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-600/10 to-blue-400/10 border border-blue-500/30 rounded-2xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Contributions</p>
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
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 overflow-x-auto">
        <div className="inline-block">
          {/* Month Labels Row with Proper Alignment */}
          <div className="flex items-center mb-2">
            <div className="w-12" />
            <div className="flex gap-1">
              {calendarGrid[0] &&
                calendarGrid[0].map((_, weekIdx) => {
                  // Find if there's a month label that starts at this week
                  const monthAtWeek = months.find(
                    (m) => m.weekIndex === weekIdx
                  );
                  return (
                    <div
                      key={`month-${weekIdx}`}
                      className="text-xs text-gray-400 font-semibold flex items-center justify-center"
                      style={{ width: "24px", height: "20px" }}
                    >
                      {monthAtWeek ? monthAtWeek.label : ""}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex gap-1">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 justify-start pt-1">
              {dayLabels.map((day, idx) => (
                <div
                  key={idx}
                  className="text-xs text-gray-500 font-medium"
                  style={{ height: "24px", lineHeight: "24px" }}
                >
                  {day}
                </div>
              ))}
              {/* Fill the remaining space */}
              <div style={{ height: "24px" }} />
            </div>

            {/* Weeks */}
            <div className="flex gap-1">
              {calendarGrid[0] &&
                calendarGrid[0].map((_, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {calendarGrid.map((_, dayIdx) => {
                      const cell = calendarGrid[dayIdx][weekIdx];
                      return (
                        <div
                          key={`${weekIdx}-${dayIdx}`}
                          className={`w-6 h-6 rounded-sm cursor-pointer transition-all duration-200 ${getContributionColor(
                            cell?.count || 0
                          )}`}
                          title={
                            cell
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
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-gray-500 text-sm">
          Learn how we count contributions
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
