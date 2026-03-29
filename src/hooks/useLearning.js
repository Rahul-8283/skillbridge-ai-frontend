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
  const userId = user?._id || user?.id;

  // Fetch learning plans on mount
  useEffect(() => {
    if (userId) {
      fetchLearningPlans(userId);
      fetchAchievements(userId);
      fetchProgressStats(userId);
    }
  }, [userId, fetchLearningPlans, fetchAchievements, fetchProgressStats]);

  const handleGenerateLearningPlan = async (jobId, hoursPerDay = 2) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return generateLearningPlan(userId, jobId, hoursPerDay);
  };

  const handleLogActivity = async (activity) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return logActivity(userId, activity);
  };

  const handleFetchActivities = async (dateRange = {}) => {
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
    fetchLearningPlans: () => fetchLearningPlans(userId),
    fetchLearningPlan,
    updateLearningPlan,
    deleteLearningPlan,
    logActivity: handleLogActivity,
    fetchActivities: handleFetchActivities,
    fetchAchievements: () => fetchAchievements(userId),
    fetchProgressStats: () => fetchProgressStats(userId),
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
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      fetchLearningPlans(userId);
    }
  }, [userId, fetchLearningPlans]);

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
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      fetchActivities(userId);
    }
  }, [userId, fetchActivities]);

  const handleLogActivity = async (activity) => {
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
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      fetchAchievements(userId);
    }
  }, [userId, fetchAchievements]);

  return { achievements, progressStats, isLoading };
};
