// Export all custom hooks
export { useAuth, useRequireAuth, useUserRole, useIsSeeker, useIsProvider } from "./useAuth";
export { useUser, useProfileCompletion, useSkills } from "./useUser";
export { useResume, useExtractedSkills, useResumeUpload } from "./useResume";
export {
  useJobs,
  useJobMatches,
  useJobDetail,
  useIsJobApplied,
  useJobProvider,
} from "./useJobs";
export {
  useLearning,
  useLearningPlans,
  useCurrentLearningPlan,
  useLearningActivities,
  useAchievements,
} from "./useLearning";
