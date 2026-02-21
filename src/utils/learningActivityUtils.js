/**
 * Fetches user's learning activities from localStorage
 * @param {string} userEmail - User's email
 * @returns {Object} Learning activities with dates as keys
 */
export const fetchLearningActivities = (userEmail) => {
  if (!userEmail) return {};
  const activities =
    localStorage.getItem(`${userEmail}_learning_activities`);
  return activities ? JSON.parse(activities) : {};
};

/**
 * Saves learning activity to localStorage
 * @param {string} userEmail - User's email
 * @param {Object} activities - Learning activities object
 */
export const saveLearningActivities = (userEmail, activities) => {
  if (!userEmail) return;
  localStorage.setItem(
    `${userEmail}_learning_activities`,
    JSON.stringify(activities)
  );
};

/**
 * Tracks a learning activity for today
 * @param {string} userEmail - User's email
 */
export const trackLearningActivity = (userEmail) => {
  const today = new Date().toISOString().split("T")[0];
  const activities = fetchLearningActivities(userEmail);
  activities[today] = (activities[today] || 0) + 1;
  saveLearningActivities(userEmail, activities);
};

/**
 * Generates calendar grid for the past year
 * @param {Object} activities - Learning activities object
 * @returns {Object} Object containing grid, months, and stats
 */
export const generateCalendarGrid = (activities = {}) => {
  const today = new Date();
  
  // Create a grid: 7 rows (days of week) × 53 columns (weeks)
  const grid = Array(7)
    .fill(null)
    .map(() => Array(53).fill(null));

  const monthLabels = []; // Array of {label, weekIndex}
  const monthSet = new Set();
  let totalContributions = 0;
  let weekCol = 52;
  let lastMonth = null;

  // Fill the grid
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dayOfWeek = date.getDay();
    const row = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 6, Monday = 0

    const dateStr = date.toISOString().split("T")[0];
    const count = activities[dateStr] || 0;

    grid[row][weekCol] = {
      date: dateStr,
      count: count,
      displayDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    if (count > 0) {
      totalContributions += count;
    }

    // Track month with week position
    const monthKey = date.toLocaleDateString("en-US", { month: "short" });
    
    if (monthKey !== lastMonth && !monthSet.has(monthKey)) {
      monthLabels.push({ label: monthKey, weekIndex: weekCol });
      monthSet.add(monthKey);
      lastMonth = monthKey;
    }

    // Move to next week column when we hit Sunday
    if (row === 6) {
      weekCol--;
    }
  }

  // Calculate streaks
  const { maxStreak, currentStreak } = calculateStreaks(activities);

  return {
    grid,
    months: monthLabels.reverse(),
    stats: {
      totalContributions,
      maxStreak,
      currentStreak,
    },
  };
};

/**
 * Calculates max and current streaks
 * @param {Object} activities - Learning activities object
 * @returns {Object} Object containing maxStreak and currentStreak
 */
export const calculateStreaks = (activities = {}) => {
  const today = new Date();
  let maxStreak = 0;
  let currentStreak = 0;
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split("T")[0];
    const count = activities[dateStr];

    if (count && count > 0) {
      streak++;
      if (i === 0) currentStreak = streak;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 0;
    }
  }

  return { maxStreak, currentStreak };
};

/**
 * Gets color class based on contribution count
 * @param {number} count - Number of contributions
 * @returns {string} Tailwind color class
 */
export const getContributionColor = (count) => {
  if (!count || count === 0) return "bg-slate-800 hover:bg-slate-700";
  if (count === 1) return "bg-green-900 hover:bg-green-800";
  if (count === 2) return "bg-green-700 hover:bg-green-600";
  if (count === 3) return "bg-green-600 hover:bg-green-500";
  if (count === 4) return "bg-green-500 hover:bg-green-400";
  return "bg-green-400 hover:bg-green-300";
};

/**
 * Increments learning activity for a specific date
 * @param {string} userEmail - User's email
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {Object} Updated activities object
 */
export const incrementActivityForDate = (userEmail, dateStr = null) => {
  const date = dateStr ? new Date(dateStr) : new Date();
  const dateKey = date.toISOString().split("T")[0];
  
  const activities = fetchLearningActivities(userEmail);
  activities[dateKey] = (activities[dateKey] || 0) + 1;
  
  saveLearningActivities(userEmail, activities);
  return activities;
};
