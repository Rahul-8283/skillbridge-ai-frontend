import { create } from "zustand";
import api from "../utils/api";

export const useLearningStore = create((set, get) => ({
  // State
  learningPlans: [],
  currentPlan: null,
  activities: [],
  achievements: [],
  progressStats: {},
  isLoading: false,
  error: null,

  // Actions - Learning Plans
  generateLearningPlan: async (userId, jobId, hoursPerDay = 2) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/learning-plan/generate", {
        userId,
        jobId,
        hoursPerDay
      }, {
        timeout: 180000 // 3 minutes for AI generation
      });

      const newPlan = response.data;
      set({
        currentPlan: newPlan,
        learningPlans: [...get().learningPlans, newPlan],
        isLoading: false,
      });
      return { success: true, plan: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  fetchLearningPlans: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/user/${userId}/learning-plans`);
      const plans = response.data || [];
      set({ 
        learningPlans: plans, 
        currentPlan: get().currentPlan || (plans.length > 0 ? plans[0] : null),
        isLoading: false 
      });
      return { success: true, plans };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  fetchLearningPlan: async (planId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/learning-plan/${planId}`);
      set({ currentPlan: response, isLoading: false });
      return { success: true, plan: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updateLearningPlan: async (planId, planData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/learning-plan/${planId}`, planData);
      const updated = get().learningPlans.map((plan) =>
        plan._id === planId ? response : plan
      );
      set({
        learningPlans: updated,
        currentPlan:
          get().currentPlan?._id === planId ? response : get().currentPlan,
        isLoading: false,
      });
      return { success: true, plan: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteLearningPlan: async (planId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/learning-plan/${planId}`);
      set({
        learningPlans: get().learningPlans.filter((p) => p._id !== planId),
        currentPlan:
          get().currentPlan?._id === planId ? null : get().currentPlan,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Actions - Learning Activities
  logActivity: async (userId, activity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/learning-activity/log", {
        userId,
        ...activity,
      });
      set({
        activities: [...get().activities, response],
        isLoading: false,
      });
      return { success: true, activity: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  fetchActivities: async (userId, dateRange = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/user/${userId}/activities`, {
        params: dateRange,
      });
      set({ activities: response, isLoading: false });
      return { success: true, activities: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Actions - Achievements & Badges
  fetchAchievements: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/user/${userId}/achievements`);
      set({ achievements: response, isLoading: false });
      return { success: true, achievements: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Actions - Progress Stats
  fetchProgressStats: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/user/${userId}/progress`);
      set({ progressStats: response, isLoading: false });
      return { success: true, stats: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Local Actions
  addActivity: (activity) => {
    set({ activities: [...get().activities, activity] });
  },

  clearCurrentPlan: () => set({ currentPlan: null }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
