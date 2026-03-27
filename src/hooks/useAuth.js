import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

/**
 * Custom hook for authentication
 * Usage: const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUser,
    initializeAuth,
    clearError,
  } = useAuthStore();

  // Initialize auth on component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUser,
    clearError,
  };
};

/**
 * Hook to check if user is authenticated, redirect if not
 */
export const useRequireAuth = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated]);

  return { isAuthenticated, user };
};

/**
 * Hook to check user role
 */
export const useUserRole = () => {
  const { user } = useAuth();
  return user?.role || null;
};

/**
 * Hook to check if user is a seeker
 */
export const useIsSeeker = () => {
  const role = useUserRole();
  return role === "seeker";
};

/**
 * Hook to check if user is a provider (recruiter)
 */
export const useIsProvider = () => {
  const role = useUserRole();
  return role === "provider";
};
