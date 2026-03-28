import { useEffect } from "react";
import { useLearningStore } from "../stores/learningStore";
import { useAuth } from "./useAuth";

/**
 * Custom hook for learning management
 * Usage: const { currentPlan, learningPlans, generateLearningPlan } = useLearning();
 */
export const useLearning = () => {
  const {
    learningPlans,
    currentPlan,
    activities,
    achievements,
    progressStats,
    isLoading,
    error,
    generateLearningPlan,
    fetchLearningPlans,
    fetchLearningPlan,
    updateLearningPlan,
    deleteLearningPlan,
    logActivity,
    fetchActivities,
    fetchAchievements,
    fetchProgressStats,
    addActivity,
    clearCurrentPlan,
    clearError,
  } = useLearningStore();

  const { user } = useAuth();

  // Fetch learning plans on mount
  useEffect(() => {
    if (user?._id) {
      fetchLearningPlans(user._id);
      fetchAchievements(user._id);
      fetchProgressStats(user._id);
    }
  }, [user?._id, fetchLearningPlans, fetchAchievements, fetchProgressStats]);

  const handleGenerateLearningPlan = async (jobId, hoursPerDay = 2) => {
    const userId = user?._id || user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return generateLearningPlan(userId, jobId, hoursPerDay);
  };

  const handleLogActivity = async (activity) => {
    const userId = user?._id || user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return logActivity(userId, activity);
  };

  const handleFetchActivities = async (dateRange = {}) => {
    const userId = user?._id || user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return fetchActivities(userId, dateRange);
  };

  return {
    learningPlans,
    currentPlan,
    activities,
    achievements,
    progressStats,
    isLoading,
    error,
    generateLearningPlan: handleGenerateLearningPlan,
    fetchLearningPlans: () => fetchLearningPlans(user?._id),
    fetchLearningPlan,
    updateLearningPlan,
    deleteLearningPlan,
    logActivity: handleLogActivity,
    fetchActivities: handleFetchActivities,
    fetchAchievements: () => fetchAchievements(user?._id),
    fetchProgressStats: () => fetchProgressStats(user?._id),
    addActivity,
    clearCurrentPlan,
    clearError,
  };
};

/**
 * Hook for learning plans
 */
export const useLearningPlans = () => {
  const { learningPlans, isLoading, fetchLearningPlans } = useLearningStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      fetchLearningPlans(user._id);
    }
  }, [user?._id, fetchLearningPlans]);

  return { learningPlans, isLoading };
};

/**
 * Hook for current learning plan
 */
export const useCurrentLearningPlan = () => {
  const { currentPlan, isLoading, updateLearningPlan, deleteLearningPlan } =
    useLearningStore();

  return { currentPlan, isLoading, updateLearningPlan, deleteLearningPlan };
};

/**
 * Hook for learning activities
 */
export const useLearningActivities = () => {
  const { activities, isLoading, logActivity, fetchActivities } =
    useLearningStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      fetchActivities(user._id);
    }
  }, [user?._id, fetchActivities]);

  const handleLogActivity = async (activity) => {
    const userId = user?._id || user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return logActivity(userId, activity);
  };

  return { activities, isLoading, logActivity: handleLogActivity };
};

/**
 * Hook for achievements and progress
 */
export const useAchievements = () => {
  const { achievements, progressStats, isLoading, fetchAchievements } =
    useLearningStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      fetchAchievements(user._id);
    }
  }, [user?._id, fetchAchievements]);

  return { achievements, progressStats, isLoading };
};
