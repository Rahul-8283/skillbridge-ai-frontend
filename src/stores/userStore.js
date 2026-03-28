import { create } from "zustand";
import api from "../utils/api";

export const useUserStore = create((set, get) => ({
  // State
  profile: null,
  profileCompletion: 0,
  skills: [],
  preferences: {},
  isLoading: false,
  error: null,

  // Actions
  fetchProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/user/profile/${userId}`);
      set({ profile: response, isLoading: false });
      return { success: true, profile: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updateProfile: async (userId, profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/user/profile/${userId}`, profileData);
      set({ profile: response, isLoading: false });
      return { success: true, profile: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  calculateProfileCompletion: (profile) => {
    if (!profile) return 0;

    let completedFields = 0;
    const totalFields = 6; // name, email, role, experience, skills, preferences

    if (profile.name) completedFields++;
    if (profile.email) completedFields++;
    if (profile.role) completedFields++;
    if (profile.experience) completedFields++;
    if (profile.skills && profile.skills.length > 0) completedFields++;
    if (profile.preferences && Object.keys(profile.preferences).length > 0)
      completedFields++;

    const percentage = Math.round((completedFields / totalFields) * 100);
    set({ profileCompletion: percentage });
    return percentage;
  },

  setSkills: (skills) => set({ skills }),

  addSkill: (skill) => {
    const currentSkills = get().skills;
    if (!currentSkills.includes(skill)) {
      set({ skills: [...currentSkills, skill] });
    }
  },

  removeSkill: (skill) => {
    set({ skills: get().skills.filter((s) => s !== skill) });
  },

  setPreferences: (preferences) => set({ preferences }),

  updatePreference: (key, value) => {
    const currentPreferences = get().preferences;
    set({ preferences: { ...currentPreferences, [key]: value } });
  },

  clearProfile: () =>
    set({ profile: null, profileCompletion: 0, skills: [], preferences: {} }),

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
