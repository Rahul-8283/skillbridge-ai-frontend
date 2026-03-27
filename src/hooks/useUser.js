import { useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import { useAuth } from "./useAuth";

/**
 * Custom hook for user profile management
 * Usage: const { profile, skills, updateProfile } = useUser();
 */
export const useUser = () => {
  const {
    profile,
    profileCompletion,
    skills,
    preferences,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    calculateProfileCompletion,
    setSkills,
    addSkill,
    removeSkill,
    setPreferences,
    updatePreference,
    clearProfile,
    clearError,
  } = useUserStore();

  const { user } = useAuth();

  // Fetch profile on mount if user exists
  useEffect(() => {
    if (user?._id) {
      fetchProfile(user._id);
    }
  }, [user?._id, fetchProfile]);

  // Calculate profile completion when profile changes
  useEffect(() => {
    if (profile) {
      calculateProfileCompletion(profile);
    }
  }, [profile, calculateProfileCompletion]);

  return {
    profile,
    profileCompletion,
    skills,
    preferences,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    setSkills,
    addSkill,
    removeSkill,
    setPreferences,
    updatePreference,
    clearProfile,
    clearError,
  };
};

/**
 * Hook for profile completion percentage
 */
export const useProfileCompletion = () => {
  const { profileCompletion } = useUserStore();
  return profileCompletion;
};

/**
 * Hook for user skills management
 */
export const useSkills = () => {
  const { skills, addSkill, removeSkill, setSkills } = useUserStore();

  return { skills, addSkill, removeSkill, setSkills };
};
