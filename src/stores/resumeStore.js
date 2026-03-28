import { create } from "zustand";
import api from "../utils/api";

export const useResumeStore = create((set, get) => ({
  // State
  resume: null,
  extractedSkills: [],
  uploadProgress: 0,
  isLoading: false,
  error: null,
  resumes: [], // List of user's resumes

  // Actions
  uploadResume: async (file, userId) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      // Upload with progress tracking
      const response = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          set({ uploadProgress: progress });
        },
      });

      set({
        resume: response,
        extractedSkills: response.extractedSkills || [],
        isLoading: false,
        uploadProgress: 100,
      });
      return { success: true, resume: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  fetchResume: async (resumeId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/resume/${resumeId}`);
      set({
        resume: response,
        extractedSkills: response.extractedSkills || [],
        isLoading: false,
      });
      return { success: true, resume: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  fetchUserResumes: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/user/${userId}/resumes`);
      set({ resumes: response, isLoading: false });
      return { success: true, resumes: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteResume: async (resumeId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/resume/${resumeId}`);
      set({
        resumes: get().resumes.filter((r) => r._id !== resumeId),
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  extractSkillsManually: async (text) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/resume/extract-skills", { text });
      set({ extractedSkills: response.skills, isLoading: false });
      return { success: true, skills: response.skills };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  setExtractedSkills: (skills) => set({ extractedSkills: skills }),

  addSkill: (skill) => {
    const currentSkills = get().extractedSkills;
    if (!currentSkills.includes(skill)) {
      set({ extractedSkills: [...currentSkills, skill] });
    }
  },

  removeSkill: (skill) => {
    set({ extractedSkills: get().extractedSkills.filter((s) => s !== skill) });
  },

  clearResume: () =>
    set({ resume: null, extractedSkills: [], uploadProgress: 0 }),

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
