import { useEffect } from "react";
import { useJobStore } from "../stores/jobStore";
import { useAuth } from "./useAuth";

/**
 * Custom hook for job management
 * Usage: const { jobs, fetchMatchedJobs, applyForJob } = useJobs();
 */
export const useJobs = () => {
  const {
    jobs,
    matchedJobs,
    jobDetails,
    appliedJobs,
    userApplications,
    isLoading,
    error,
    totalMatches,
    filters,
    fetchAllJobs,
    fetchMatchedJobs,
    fetchJobDetails,
    applyForJob,
    fetchUserApplications,
    postJob,
    updateJob,
    deleteJob,
    setFilters,
    getSkillGap,
    clearJobDetails,
    clearError,
  } = useJobStore();

  const { user } = useAuth();

  // Fetch matched jobs on mount for seeker
  useEffect(() => {
    if (user?._id && user?.role === "seeker") {
      fetchMatchedJobs(user._id, filters);
    }
  }, [user?._id, user?.role, filters, fetchMatchedJobs]);

  // Fetch user applications
  useEffect(() => {
    if (user?._id) {
      fetchUserApplications(user._id);
    }
  }, [user?._id, fetchUserApplications]);

  const handleApplyForJob = async (jobId, coverLetter = "") => {
    if (!user?._id) {
      throw new Error("User not authenticated");
    }
    return applyForJob(jobId, user._id, coverLetter);
  };

  return {
    jobs,
    matchedJobs,
    jobDetails,
    appliedJobs,
    userApplications,
    isLoading,
    error,
    totalMatches,
    filters,
    fetchAllJobs,
    fetchMatchedJobs,
    fetchJobDetails,
    applyForJob: handleApplyForJob,
    fetchUserApplications,
    postJob,
    updateJob,
    deleteJob,
    setFilters,
    getSkillGap,
    clearJobDetails,
    clearError,
  };
};

/**
 * Hook for job matching (seeker)
 */
export const useJobMatches = () => {
  const { matchedJobs, totalMatches, isLoading, filters, setFilters } =
    useJobStore();

  return { matchedJobs, totalMatches, isLoading, filters, setFilters };
};

/**
 * Hook for job details view
 */
export const useJobDetail = (jobId) => {
  const { jobDetails, isLoading, fetchJobDetails } = useJobStore();

  useEffect(() => {
    if (jobId) {
      fetchJobDetails(jobId);
    }
  }, [jobId, fetchJobDetails]);

  return { jobDetails, isLoading };
};

/**
 * Hook for checking if job is applied
 */
export const useIsJobApplied = (jobId) => {
  const { appliedJobs } = useJobStore();
  return appliedJobs.includes(jobId);
};

/**
 * Hook for job provider operations
 */
export const useJobProvider = () => {
  const { jobs, isLoading, postJob, updateJob, deleteJob, fetchAllJobs } =
    useJobStore();

  return { jobs, isLoading, postJob, updateJob, deleteJob, fetchAllJobs };
};
