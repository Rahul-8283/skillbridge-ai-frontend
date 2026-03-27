import { useEffect } from "react";
import { useResumeStore } from "../stores/resumeStore";
import { useAuth } from "./useAuth";

/**
 * Custom hook for resume management
 * Usage: const { resume, uploadResume, extractedSkills } = useResume();
 */
export const useResume = () => {
  const {
    resume,
    extractedSkills,
    uploadProgress,
    isLoading,
    error,
    resumes,
    uploadResume,
    fetchResume,
    fetchUserResumes,
    deleteResume,
    extractSkillsManually,
    setExtractedSkills,
    addSkill,
    removeSkill,
    clearResume,
    clearError,
  } = useResumeStore();

  const { user } = useAuth();

  // Fetch user's resumes on mount
  useEffect(() => {
    if (user?._id) {
      fetchUserResumes(user._id);
    }
  }, [user?._id, fetchUserResumes]);

  const handleUploadResume = async (file) => {
    if (!user?._id) {
      throw new Error("User not authenticated");
    }
    return uploadResume(file, user._id);
  };

  return {
    resume,
    extractedSkills,
    uploadProgress,
    isLoading,
    error,
    resumes,
    uploadResume: handleUploadResume,
    fetchResume,
    fetchUserResumes,
    deleteResume,
    extractSkillsManually,
    setExtractedSkills,
    addSkill,
    removeSkill,
    clearResume,
    clearError,
  };
};

/**
 * Hook for extracted skills from resume
 */
export const useExtractedSkills = () => {
  const { extractedSkills, addSkill, removeSkill, setExtractedSkills } =
    useResumeStore();

  return { extractedSkills, addSkill, removeSkill, setExtractedSkills };
};

/**
 * Hook for resume upload progress
 */
export const useResumeUpload = () => {
  const { uploadProgress, isLoading, uploadResume } = useResumeStore();
  const { user } = useAuth();

  const handleUpload = async (file) => {
    if (!user?._id) {
      throw new Error("User not authenticated");
    }
    return uploadResume(file, user._id);
  };

  return { uploadProgress, isLoading, uploadResume: handleUpload };
};
