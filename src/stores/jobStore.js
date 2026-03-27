import { create } from "zustand";
import api from "../utils/api";

export const useJobStore = create((set, get) => ({
  // State
  jobs: [],
  matchedJobs: [],
  jobDetails: null,
  appliedJobs: [],
  userApplications: [],
  isLoading: false,
  error: null,
  totalMatches: 0,
  filters: { minMatch: 50, category: "", experience: "" },

  // Actions - Fetch Jobs
  fetchAllJobs: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/api/jobs", { params: filters });
      set({ jobs: response.jobs || [], isLoading: false });
      return { success: true, jobs: response.jobs };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  fetchMatchedJobs: async (userId, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/jobs/matches/${userId}`, {
        params: filters,
      });
      set({
        matchedJobs: response.jobs || [],
        totalMatches: response.total || 0,
        isLoading: false,
      });
      return { success: true, jobs: response.jobs, total: response.total };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  fetchJobDetails: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/jobs/${jobId}`);
      set({ jobDetails: response, isLoading: false });
      return { success: true, job: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Actions - Job Applications
  applyForJob: async (jobId, userId, coverLetter = "") => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/jobs/${jobId}/apply`, {
        userId,
        coverLetter,
      });
      set({
        appliedJobs: [...get().appliedJobs, jobId],
        isLoading: false,
      });
      return { success: true, application: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  fetchUserApplications: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/user/${userId}/applications`);
      const appliedJobIds = response.map((app) => app.jobId);
      set({ userApplications: response, appliedJobs: appliedJobIds, isLoading: false });
      return { success: true, applications: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Actions - For Job Providers
  postJob: async (jobData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/api/jobs/post", jobData);
      set({ jobs: [...get().jobs, response], isLoading: false });
      return { success: true, job: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updateJob: async (jobId, jobData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/jobs/${jobId}`, jobData);
      const updatedJobs = get().jobs.map((job) =>
        job._id === jobId ? response : job
      );
      set({ jobs: updatedJobs, isLoading: false });
      return { success: true, job: response };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteJob: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/jobs/${jobId}`);
      set({ jobs: get().jobs.filter((job) => job._id !== jobId), isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Actions - Filters & State Management
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  getSkillGap: async (jobId, userId) => {
    try {
      const response = await api.get(`/api/jobs/${jobId}/skill-gap/${userId}`);
      return { success: true, gap: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  clearJobDetails: () => set({ jobDetails: null }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
