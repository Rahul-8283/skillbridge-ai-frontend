/**
 * HOOKS USAGE GUIDE - SkillBridge AI Frontend
 * 
 * This file demonstrates how to use all custom hooks in your components
 * Import from: import { useAuth, useUser, useJobs, ... } from '@/hooks'
 */

// ============================================
// AUTHENTICATION HOOKS
// ============================================

/**
 * useAuth() - Main authentication hook
 * 
 * Returns:
 * - user: Current authenticated user object
 * - token: JWT token
 * - isAuthenticated: Boolean
 * - isLoading: Boolean
 * - error: String or null
 * - login: Async function (email, password)
 * - signup: Async function (email, password, name, role)
 * - logout: Function
 * - updateUser: Async function (userData)
 * - clearError: Function
 * 
 * Example Component:
 */

import { useAuth } from "@/hooks";

function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      // Redirected automatically by zustand/api interceptor
      navigate("/dashboard");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <button disabled={isLoading}>{isLoading ? "Loading..." : "Login"}</button>
    </form>
  );
}

/**
 * useRequireAuth() - Protect routes
 * Automatically redirects to /login if not authenticated
 * 
 * Example:
 */

function ProtectedPage() {
  const { isAuthenticated, user } = useRequireAuth();

  if (!isAuthenticated) return null; // Redirect happens in hook

  return <div>Welcome, {user.name}!</div>;
}

/**
 * useUserRole(), useIsSeeker(), useIsProvider()
 * Check user role
 * 
 * Example:
 */

function RoleBasedNav() {
  const isSeeker = useIsSeeker();
  const isProvider = useIsProvider();

  return (
    <nav>
      {isSeeker && <link to="/seeker-dashboard">Dashboard</link>}
      {isProvider && <link to="/provider-dashboard">Recruiter Hub</link>}
    </nav>
  );
}

// ============================================
// USER PROFILE HOOKS
// ============================================

/**
 * useUser() - Complete user profile management
 * 
 * Returns:
 * - profile: User profile object
 * - profileCompletion: Percentage (0-100)
 * - skills: Array of skills
 * - preferences: Object
 * - isLoading, error
 * - Methods: updateProfile, addSkill, removeSkill, setPreferences, etc.
 * 
 * Example:
 */

function ProfilePage() {
  const { profile, profileCompletion, updateProfile, isLoading } = useUser();

  const handleUpdateProfile = async () => {
    await updateProfile(profile._id, {
      name: "New Name",
      experience: "3 years",
    });
  };

  return (
    <div>
      <div className="completion">Completion: {profileCompletion}%</div>
      <button onClick={handleUpdateProfile} disabled={isLoading}>
        Update Profile
      </button>
    </div>
  );
}

/**
 * useProfileCompletion() - Only get completion %
 */

function DashboardHeader() {
  const completion = useProfileCompletion();
  return <span>Profile: {completion}%</span>;
}

/**
 * useSkills() - Manage user skills
 */

function SkillsManager() {
  const { skills, addSkill, removeSkill } = useSkills();

  return (
    <div>
      {skills.map((skill) => (
        <span key={skill}>
          {skill}
          <button onClick={() => removeSkill(skill)}>Remove</button>
        </span>
      ))}
      <button onClick={() => addSkill("React")}>Add React</button>
    </div>
  );
}

// ============================================
// RESUME HOOKS
// ============================================

/**
 * useResume() - Main resume management hook
 * 
 * Returns:
 * - resume: Current resume object
 * - extractedSkills: Array of skills from resume
 * - uploadProgress: 0-100
 * - isLoading, error
 * - resumes: Array of user's resumes
 * - Methods: uploadResume, fetchResume, deleteResume, extractSkillsManually, etc.
 * 
 * Example:
 */

function ResumeUploadPage() {
  const { uploadResume, uploadProgress, extractedSkills, isLoading } =
    useResume();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const result = await uploadResume(file);
    if (result.success) {
      console.log("Extracted skills:", result.resume.extractedSkills);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} disabled={isLoading} />
      <div className="progress">{uploadProgress}%</div>
      <div className="skills">
        {extractedSkills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  );
}

/**
 * useExtractedSkills() - Just the skills from resume
 */

function SkillReview() {
  const { extractedSkills, removeSkill } = useExtractedSkills();

  return (
    <div>
      {extractedSkills.map((skill) => (
        <button key={skill} onClick={() => removeSkill(skill)}>
          {skill} ✕
        </button>
      ))}
    </div>
  );
}

/**
 * useResumeUpload() - Alternative hook just for upload progress
 */

function UploadProgress() {
  const { uploadProgress, isLoading } = useResumeUpload();

  return isLoading ? <div className="bar" style={{ width: uploadProgress + "%" }} /> : null;
}

// ============================================
// JOB HOOKS
// ============================================

/**
 * useJobs() - Complete job management
 * 
 * Returns:
 * - jobs: All jobs
 * - matchedJobs: Jobs matched to user
 * - jobDetails: Currently viewing job
 * - appliedJobs: IDs of jobs applied to
 * - userApplications: Full application objects
 * - totalMatches, filters, isLoading, error
 * - Methods: fetchMatchedJobs, fetchJobDetails, applyForJob, postJob, etc.
 * 
 * Example:
 */

function JobsPage() {
  const { matchedJobs, totalMatches, applyForJob, setFilters, isLoading } =
    useJobs();

  const handleApply = async (jobId) => {
    const result = await applyForJob(jobId, "I'm interested!");
    if (result.success) {
      alert("Applied successfully!");
    }
  };

  const handleFilter = () => {
    setFilters({ minMatch: 75, category: "Engineering" });
  };

  return (
    <div>
      <button onClick={handleFilter}>High Tech Jobs</button>
      <p>Found {totalMatches} matches</p>
      {matchedJobs.map((job) => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <button onClick={() => handleApply(job._id)} disabled={isLoading}>
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * useJobMatches() - Just matched jobs for seeker
 */

function JobList() {
  const { matchedJobs, filters, setFilters } = useJobMatches();

  return (
    <div>
      {matchedJobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}

/**
 * useJobDetail(jobId) - Get single job details
 */

function JobDetailPage({ jobId }) {
  const { jobDetails, isLoading } = useJobDetail(jobId);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h1>{jobDetails?.title}</h1>
      <p>{jobDetails?.description}</p>
    </div>
  );
}

/**
 * useIsJobApplied(jobId) - Check if applied
 */

function JobCard({ job }) {
  const isApplied = useIsJobApplied(job._id);

  return (
    <div>
      <h3>{job.title}</h3>
      <button disabled={isApplied}>{isApplied ? "Applied" : "Apply"}</button>
    </div>
  );
}

/**
 * useJobProvider() - For recruiters to manage job postings
 */

function ProviderJobsPage() {
  const { jobs, postJob, updateJob, deleteJob } = useJobProvider();

  const handlePostJob = async () => {
    await postJob({
      title: "Senior React Developer",
      description: "...",
      requirements: ["React", "Node.js"],
    });
  };

  return (
    <div>
      <button onClick={handlePostJob}>Post New Job</button>
      {jobs.map((job) => (
        <JobRow key={job._id} job={job} />
      ))}
    </div>
  );
}

// ============================================
// LEARNING HOOKS
// ============================================

/**
 * useLearning() - Complete learning management
 * 
 * Returns:
 * - learningPlans: Array of plans
 * - currentPlan: Active plan
 * - activities: Learning activities log
 * - achievements: Earned badges
 * - progressStats: Overall progress
 * - isLoading, error
 * - Methods: generateLearningPlan, logActivity, fetchActivities, etc.
 * 
 * Example:
 */

function LearningPage() {
  const {
    learningPlans,
    generateLearningPlan,
    logActivity,
    achievements,
    isLoading,
  } = useLearning();

  const handleGeneratePlan = async () => {
    await generateLearningPlan(["React", "TypeScript", "GraphQL"]);
  };

  const handleLogActivity = async () => {
    await logActivity({
      type: "course_completed",
      skill: "React",
      duration: 120,
    });
  };

  return (
    <div>
      <button onClick={handleGeneratePlan}>Generate Plan</button>
      <button onClick={handleLogActivity}>Log Activity</button>
      <div className="achievements">
        {achievements.map((badge) => (
          <span key={badge.id}>{badge.name}</span>
        ))}
      </div>
    </div>
  );
}

/**
 * useLearningPlans() - Just the plans
 */

function LearningPlansView() {
  const { learningPlans } = useLearningPlans();

  return (
    <ul>
      {learningPlans.map((plan) => (
        <li key={plan._id}>{plan.title}</li>
      ))}
    </ul>
  );
}

/**
 * useCurrentLearningPlan() - Active plan management
 */

function CurrentPlanView() {
  const { currentPlan, updateLearningPlan } = useCurrentLearningPlan();

  return currentPlan ? <div>{currentPlan.title}</div> : <p>No active plan</p>;
}

/**
 * useLearningActivities() - Activity logging
 */

function ActivityCalendar() {
  const { activities, logActivity } = useLearningActivities();

  return (
    <div>
      <Calendar events={activities} />
      <button onClick={() => logActivity({ type: "study", duration: 60 })}>
        Log Study Session
      </button>
    </div>
  );
}

/**
 * useAchievements() - Badges and awards
 */

function AchievementsView() {
  const { achievements, progressStats } = useAchievements();

  return (
    <div>
      <p>Total XP: {progressStats.totalXP}</p>
      <div className="badges">
        {achievements.map((badge) => (
          <Badge key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// ERROR HANDLING PATTERN
// ============================================

/**
 * All hooks provide error handling
 * 
 * Example:
 */

function ErrorHandlingExample() {
  const { login, error, clearError } = useAuth();

  return (
    <div>
      {error && (
        <div className="alert">
          {error}
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPLETE DASHBOARD EXAMPLE
// ============================================

function CompleteSeekerDashboard() {
  // Auth
  const { user, logout } = useAuth();
  const isSeeker = useIsSeeker();

  // Profile
  const { profile, profileCompletion } = useUser();

  // Resume
  const { resume, extractedSkills } = useResume();

  // Jobs
  const { matchedJobs, totalMatches, applyForJob } = useJobs();

  // Learning
  const { learningPlans, achievements } = useLearning();

  if (!isSeeker) return <div>Seeker only</div>;

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {user.name}</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <section className="profile">
        <h2>Profile: {profileCompletion}%</h2>
      </section>

      <section className="resume">
        <h2>Resume Skills</h2>
        {extractedSkills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </section>

      <section className="jobs">
        <h2>Job Matches ({totalMatches})</h2>
        {matchedJobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onApply={() => applyForJob(job._id)}
          />
        ))}
      </section>

      <section className="learning">
        <h2>Learning Plans</h2>
        {learningPlans.map((plan) => (
          <PlanCard key={plan._id} plan={plan} />
        ))}
      </section>

      <section className="achievements">
        <h2>Achievements</h2>
        {achievements.map((badge) => (
          <Badge key={badge.id} badge={badge} />
        ))}
      </section>
    </div>
  );
}

export default CompleteSeekerDashboard;
