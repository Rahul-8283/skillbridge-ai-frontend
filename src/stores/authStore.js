import { create } from "zustand";
import api from "../utils/api";

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { user, token } = response;

      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  signup: async (email, password, name, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/api/auth/signup", {
        email,
        password,
        name,
        role,
      });
      const { user, token } = response;

      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    // TODO: Once backend is ready, this will restore JWT tokens from localStorage
    // For now, do NOT auto-login from localStorage to avoid mock data conflicts
    // Backend will provide real tokens that we'll store here
    
    // const token = localStorage.getItem("access_token");
    // const user = localStorage.getItem("user");
    // if (token && user) {
    //   set({
    //     token,
    //     user: JSON.parse(user),
    //     isAuthenticated: true,
    //   });
    // }
    
    // Clean up any existing mock data on init
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put("/api/user/profile", userData);
      const updatedUser = { ...get().user, ...response };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return { success: true, user: updatedUser };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
