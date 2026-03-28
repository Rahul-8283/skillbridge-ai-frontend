# SkillBridge AI - Complete API Workflow & Endpoints

## 📋 Overview

This document describes the complete workflow of SkillBridge AI frontend, showing how data flows from React components through custom hooks to Zustand stores and finally to backend API calls.

**Frontend Architecture:**
```
React Component → Custom Hook → Zustand Store → Axios API Interceptor → Backend API
```

---

## 🔐 Authentication System

### Environment Configuration
```env
VITE_BACKEND_URL_DEV=http://localhost:5000
VITE_BACKEND_URL_PROD=https://skillbridge-ai-backend.onrender.com/
```

### Token Management
- **Token Storage:** `localStorage.getItem("access_token")`
- **Token Header:** `Authorization: Bearer {access_token}`
- **Auto-Injection:** Axios request interceptor automatically adds token to all requests
- **Auto-Logout:** 401 status triggers logout and redirect to `/login`

---

## 🏗️ Store Architecture

The frontend uses **5 Zustand stores** to manage application state:

1. **authStore** - User authentication (login, signup, logout)
2. **userStore** - User profile management
3. **resumeStore** - Resume upload and skill extraction
4. **jobStore** - Job browsing, matching, and applications
5. **learningStore** - Learning plans and activities

Each store has **custom hooks** that wrap store actions for type-safe usage in components.

---

## 🔑 AUTH STORE

**Location:** `src/stores/authStore.js`
**Hook:** `useAuth()` from `src/hooks/useAuth.js`

### State
```javascript
{
  user: null,              // { id, email, name, role, ...}
  token: null,             // JWT token
  isAuthenticated: false,  // boolean
  isLoading: false,        // loading indicator
  error: null              // error message
}
```

### API Endpoints (3 total)

#### 1. POST /api/auth/login
**Usage:** User login
```javascript
const { login } = useAuth();
const result = await login("user@example.com", "password123");
// Returns: { success: true, user: {...} } or { success: false, error: "..." }
```
**Flow:**
- Component (LoginPage) → useAuth hook → authStore.login()
- Sends: { email, password }
- Receives: { user, token }
- Action: Stores token & user in localStorage
- Navigation: Redirect to dashboard based on user.role

#### 2. POST /api/auth/signup
**Usage:** User registration
```javascript
const { signup } = useAuth();
const result = await signup("user@example.com", "password123", "John Doe", "seeker");
// Returns: { success: true, user: {...} } or { success: false, error: "..." }
```
**Flow:**
- Component (SignUpPage) → useAuth hook → authStore.signup()
- Sends: { email, password, name, role }
- Receives: { user, token }
- Action: Stores token & user in localStorage
- Navigation: Redirect to appropriate dashboard (seeker/provider)
- Roles: "seeker" or "provider"

#### 3. PUT /api/user/profile
**Usage:** Update authenticated user profile
```javascript
const { updateUser } = useAuth();
const result = await updateUser({ name: "John", bio: "Full Stack Dev" });
// Returns: { success: true, user: {...} } or { success: false, error: "..." }
```
**Flow:**
- Component → useAuth hook → authStore.updateUser()
- Sends: { name, bio, skills, ... }
- Receives: Updated user object
- Action: Updates localStorage with new user data, updates Zustand state
- Note: Token auto-injected by interceptor

---

## 👤 USER STORE

**Location:** `src/stores/userStore.js`
**Hook:** `useUser()` from `src/hooks/useUser.js`

### State
```javascript
{
  profile: null,           // { id, name, email, skills, preferences, ... }
  profileCompletion: 0,    // percentage 0-100
  skills: [],              // array of skill objects
  preferences: {},         // user preferences
  isLoading: false,
  error: null
}
```

### API Endpoints (2 total)

#### 1. GET /api/user/profile/{userId}
**Usage:** Fetch user profile
```javascript
const { fetchUserProfile } = useUser();
const result = await fetchUserProfile("user123");
// Returns: { success: true, profile: {...} }
```
**Flow:**
- Component (ProfilePage) → useUser hook → userStore.fetchUserProfile()
- URL: `/api/user/profile/{userId}` (userId from auth context)
- Receives: Complete user profile object
- Action: Stores in Zustand state

#### 2. PUT /api/user/profile/{userId}
**Usage:** Update user profile
```javascript
const { updateUserProfile } = useUser();
const result = await updateUserProfile("user123", { skills: ["React", "Node"], bio: "..." });
// Returns: { success: true, profile: {...} }
```
**Flow:**
- Component (ProfilePage form) → useUser hook → userStore.updateUserProfile()
- URL: `/api/user/profile/{userId}`
- Sends: { skills: [], bio: "", preferences: {} }
- Receives: Updated profile object
- Action: Stores updated profile in Zustand state

---

## 📄 RESUME STORE

**Location:** `src/stores/resumeStore.js`
**Hook:** `useResume()` from `src/hooks/useResume.js`

### State
```javascript
{
  resume: null,            // { id, filename, uploadedAt, ... }
  extractedSkills: [],     // array of extracted skills from resume
  uploadProgress: 0,       // percentage 0-100 during upload
  resumes: [],             // array of all user resumes
  isLoading: false,
  error: null
}
```

### API Endpoints (5 total)

#### 1. POST /api/resume/upload
**Usage:** Upload resume file
```javascript
const { uploadResume } = useResume();
const file = document.getElementById("resumeInput").files[0];
const result = await uploadResume(file, "userId123", (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
// Returns: { success: true, resume: {...} }
```
**Flow:**
- Component (UploadResumePage) → useResume hook → resumeStore.uploadResume()
- Method: POST with FormData (multipart/form-data)
- Sends: FormData with file + userId
- Receives: { resumeId, filename, uploadedAt }
- Action: Stores resume metadata, triggers skill extraction
- Special: Includes progress tracking callback for UI updates

#### 2. GET /api/resume/{resumeId}
**Usage:** Fetch specific resume
```javascript
const { fetchResume } = useResume();
const result = await fetchResume("resume123");
// Returns: { success: true, resume: {...} }
```
**Flow:**
- Component → useResume hook → resumeStore.fetchResume()
- URL: `/api/resume/{resumeId}`
- Receives: Resume object with metadata

#### 3. GET /api/user/{userId}/resumes
**Usage:** Fetch all resumes for user
```javascript
const { fetchUserResumes } = useResume();
const result = await fetchUserResumes("userId123");
// Returns: { success: true, resumes: [...] }
```
**Flow:**
- Component (Dashboard) → useResume hook → resumeStore.fetchUserResumes()
- URL: `/api/user/{userId}/resumes`
- Receives: Array of resume objects
- Action: Stores in `resumes` state

#### 4. DELETE /api/resume/{resumeId}
**Usage:** Delete resume
```javascript
const { deleteResume } = useResume();
const result = await deleteResume("resume123");
// Returns: { success: true }
```
**Flow:**
- Component (Resume List) → useResume hook → resumeStore.deleteResume()
- URL: `/api/resume/{resumeId}`
- Sends: DELETE request
- Action: Removes from `resumes` array in state

#### 5. POST /api/resume/extract-skills
**Usage:** Extract skills from resume using LLM (FastAPI)
```javascript
const { extractSkills } = useResume();
const result = await extractSkills("resume123");
// Returns: { success: true, skills: ["Python", "React", ...] }
```
**Flow:**
- Resume upload completion triggers automatic call
- Or manual: Component → useResume hook → resumeStore.extractSkills()
- Sends: { resumeId }
- Receives: { skills: [] }
- Action: Stores in `extractedSkills`, updates user skills
- Integration: Calls FastAPI backend for LLM processing

---

## 💼 JOB STORE

**Location:** `src/stores/jobStore.js`
**Hook:** `useJobs()` from `src/hooks/useJobs.js`

### State
```javascript
{
  jobs: [],                // all browsable jobs
  matchedJobs: [],         // AI-matched jobs for user
  jobDetails: null,        // single job detail
  appliedJobs: [],         // array of job IDs user applied to
  userApplications: [],    // array of application objects
  isLoading: false,
  error: null,
  totalMatches: 0,         // total count of matched jobs
  filters: {               // active filters
    minMatch: 50,
    category: "",
    experience: ""
  }
}
```

### API Endpoints (10 total)

#### 1. GET /api/jobs
**Usage:** Fetch all jobs with filters
```javascript
const { fetchAllJobs } = useJobs();
const result = await fetchAllJobs({ 
  minMatch: 50, 
  category: "tech", 
  experience: "junior" 
});
// Returns: { success: true, jobs: [...] }
```
**Flow:**
- Component (BrowseJobsPage) → useJobs hook → jobStore.fetchAllJobs()
- Query Params: filters as query parameters
- Receives: { jobs: [], total: number }
- Action: Stores in `jobs` state

#### 2. GET /api/jobs/matches/{userId}
**Usage:** Fetch AI-matched jobs for specific user
```javascript
const { fetchMatchedJobs } = useJobs();
const result = await fetchMatchedJobs("userId123", { minMatch: 70 });
// Returns: { success: true, jobs: [...], total: number }
```
**Flow:**
- Component (Dashboard) on load → useJobs hook → jobStore.fetchMatchedJobs()
- URL: `/api/jobs/matches/{userId}`
- Query: { minMatch, page, limit }
- Receives: { jobs: [], total: number, matchScores: {} }
- Action: Stores matched jobs, calculates skill gaps

#### 3. GET /api/jobs/{jobId}
**Usage:** Fetch single job details
```javascript
const { fetchJobDetails } = useJobs();
const result = await fetchJobDetails("job123");
// Returns: { success: true, job: {...} }
```
**Flow:**
- Component (JobDetailModal) → useJobs hook → jobStore.fetchJobDetails()
- URL: `/api/jobs/{jobId}`
- Receives: { id, title, description, requiredSkills, matchScore, ... }

#### 4. POST /api/jobs/{jobId}/apply
**Usage:** Apply for a job
```javascript
const { applyForJob } = useJobs();
const result = await applyForJob("job123", "userId456", "I'm very interested...");
// Returns: { success: true, application: {...} }
```
**Flow:**
- Component (JobDetailModal - Apply Button) → useJobs hook → jobStore.applyForJob()
- URL: `/api/jobs/{jobId}/apply`
- Sends: { userId, coverLetter }
- Receives: { applicationId, status, appliedAt }
- Action: Adds jobId to `appliedJobs` array, triggers notification

#### 5. GET /api/user/{userId}/applications
**Usage:** Fetch all applications from user
```javascript
const { fetchUserApplications } = useJobs();
const result = await fetchUserApplications("userId123");
// Returns: { success: true, applications: [...] }
```
**Flow:**
- Component (MyApplications page) → useJobs hook → jobStore.fetchUserApplications()
- URL: `/api/user/{userId}/applications`
- Receives: Array of application objects with job details

#### 6. POST /api/jobs/post
**Usage:** Post new job (Provider only)
```javascript
const { postJob } = useJobs();
const result = await postJob({
  title: "Senior React Developer",
  description: "...",
  requiredSkills: ["React", "Node", "AWS"],
  salary: "100k-120k",
  location: "Remote"
});
// Returns: { success: true, job: {...} }
```
**Flow:**
- Component (PostJobPage form) → useJobs hook → jobStore.postJob()
- URL: `/api/jobs/post`
- Sends: Full job data object
- Receives: Created job object with ID
- Auth: Requires provider role

#### 7. PUT /api/jobs/{jobId}
**Usage:** Update job posting (Provider only)
```javascript
const { updateJob } = useJobs();
const result = await updateJob("job123", { title: "Updated Title", salary: "120k-140k" });
// Returns: { success: true, job: {...} }
```
**Flow:**
- Component (EditJobModal) → useJobs hook → jobStore.updateJob()
- URL: `/api/jobs/{jobId}`
- Sends: Updated job fields
- Auth: Requires provider who created the job

#### 8. DELETE /api/jobs/{jobId}
**Usage:** Delete job posting (Provider only)
```javascript
const { deleteJob } = useJobs();
const result = await deleteJob("job123");
// Returns: { success: true }
```
**Flow:**
- Component (MyPostingsPage - Delete button) → useJobs hook → jobStore.deleteJob()
- URL: `/api/jobs/{jobId}`
- Method: DELETE
- Auth: Requires provider who created the job

#### 9. GET /api/jobs/{jobId}/skill-gap/{userId}
**Usage:** Get skill gap analysis for user vs job requirements
```javascript
const { analyzeSkillGap } = useJobs();
const result = await analyzeSkillGap("job123", "userId456");
// Returns: { success: true, skillGap: { missing: ["AWS"], present: ["React"] } }
```
**Flow:**
- Component (JobDetailModal - on view) → useJobs hook → jobStore.analyzeSkillGap()
- URL: `/api/jobs/{jobId}/skill-gap/{userId}`
- Receives: { missingSkills: [], presentSkills: [], recommendation: "..." }
- Action: Displays skill gap UI in job detail

#### 10. GET /api/jobs/provider/{providerId}
**Usage:** Fetch all jobs posted by provider
```javascript
const { fetchProviderJobs } = useJobs();
const result = await fetchProviderJobs("provider123");
// Returns: { success: true, jobs: [...] }
```
**Flow:**
- Component (MyPostingsPage) → useJobs hook → jobStore.fetchProviderJobs()
- URL: `/api/jobs/provider/{providerId}`
- Receives: Array of job objects posted by provider
- Auth: Requires provider role

---

## 🎓 LEARNING STORE

**Location:** `src/stores/learningStore.js`
**Hook:** `useLearning()` from `src/hooks/useLearning.js`

### State
```javascript
{
  learningPlans: [],       // array of learning plan objects
  currentPlan: null,       // selected/active learning plan
  activities: [],          // logged learning activities
  achievements: [],        // earned badges/achievements
  stats: {                 // aggregated stats
    totalHours: 0,
    totalActivities: 0,
    skillsProgressing: 0
  },
  isLoading: false,
  error: null
}
```

### API Endpoints (8 total)

#### 1. POST /api/learning-plan/generate
**Usage:** Generate personalized learning plan using LLM
```javascript
const { generateLearningPlan } = useLearning();
const result = await generateLearningPlan("userId123", {
  currentSkills: ["JavaScript", "React"],
  targetSkills: ["TypeScript", "AWS"],
  experience: "intermediate",
  timeAvailable: 10  // hours per week
});
// Returns: { success: true, plan: {...} }
```
**Flow:**
- Component (LearningPlanPage - Generate button) → useLearning hook → learningStore.generateLearningPlan()
- URL: `/api/learning-plan/generate`
- Sends: { userId, currentSkills, targetSkills, experience, timeAvailable }
- Receives: Generated learning plan with modules and timeline
- Integration: Calls FastAPI/LLM for personalized plan generation
- Action: Stores in `learningPlans` array

#### 2. GET /api/user/{userId}/learning-plans
**Usage:** Fetch all learning plans for user
```javascript
const { fetchUserLearningPlans } = useLearning();
const result = await fetchUserLearningPlans("userId123");
// Returns: { success: true, plans: [...] }
```
**Flow:**
- Component (Dashboard/LearningPlanPage) → useLearning hook → learningStore.fetchUserLearningPlans()
- URL: `/api/user/{userId}/learning-plans`
- Receives: Array of learning plan objects

#### 3. GET /api/learning-plan/{planId}
**Usage:** Fetch specific learning plan details
```javascript
const { fetchLearningPlanDetails } = useLearning();
const result = await fetchLearningPlanDetails("plan123");
// Returns: { success: true, plan: {...} }
```
**Flow:**
- Component (ViewPlanModal) → useLearning hook → learningStore.fetchLearningPlanDetails()
- URL: `/api/learning-plan/{planId}`
- Receives: Complete plan with modules, progress, timeline

#### 4. PUT /api/learning-plan/{planId}
**Usage:** Update learning plan (mark modules complete, adjust schedule, etc.)
```javascript
const { updateLearningPlan } = useLearning();
const result = await updateLearningPlan("plan123", { 
  completedModules: ["module1", "module2"],
  status: "in-progress"
});
// Returns: { success: true, plan: {...} }
```
**Flow:**
- Component (LearningPlanPage - module complete button) → useLearning hook → learningStore.updateLearningPlan()
- URL: `/api/learning-plan/{planId}`
- Sends: Updated plan fields
- Receives: Updated plan object
- Action: Updates `currentPlan` state

#### 5. DELETE /api/learning-plan/{planId}
**Usage:** Delete learning plan
```javascript
const { deleteLearningPlan } = useLearning();
const result = await deleteLearningPlan("plan123");
// Returns: { success: true }
```
**Flow:**
- Component (LearningPlanPage - Delete button) → useLearning hook → learningStore.deleteLearningPlan()
- URL: `/api/learning-plan/{planId}`
- Method: DELETE
- Action: Removes plan from `learningPlans` array

#### 6. POST /api/learning-activity/log
**Usage:** Log a learning activity (completed course, read article, practiced code, etc.)
```javascript
const { logActivity } = useLearning();
const result = await logActivity("userId123", {
  type: "course-completed",  // or "practice", "reading", "project"
  skill: "React advanced patterns",
  duration: 120,  // minutes
  description: "Completed advanced React patterns course on Udemy"
});
// Returns: { success: true, activity: {...} }
```
**Flow:**
- Component (LearningTracker) → useLearning hook → learningStore.logActivity()
- URL: `/api/learning-activity/log`
- Sends: { userId, type, skill, duration, description }
- Receives: Logged activity object with timestamp
- Action: Adds to `activities` array, may trigger achievements

#### 7. GET /api/user/{userId}/activities
**Usage:** Fetch all logged activities for user
```javascript
const { fetchUserActivities } = useLearning();
const result = await fetchUserActivities("userId123");
// Returns: { success: true, activities: [...] }
```
**Flow:**
- Component (ActivityHistory) → useLearning hook → learningStore.fetchUserActivities()
- URL: `/api/user/{userId}/activities`
- Query: { page, limit, skill, dateRange }
- Receives: Paginated array of activities

#### 8. GET /api/user/{userId}/achievements
**Usage:** Fetch user achievements and badges
```javascript
const { fetchUserAchievements } = useLearning();
const result = await fetchUserAchievements("userId123");
// Returns: { success: true, achievements: [...] }
```
**Flow:**
- Component (AchievementBadges) → useLearning hook → learningStore.fetchUserAchievements()
- URL: `/api/user/{userId}/achievements`
- Receives: Array of achievement objects with metadata
- Action: Stores in `achievements` state, displays badges

#### 9. GET /api/user/{userId}/progress
**Usage:** Fetch overall learning progress statistics
```javascript
const { fetchLearningProgress } = useLearning();
const result = await fetchLearningProgress("userId123");
// Returns: { success: true, stats: {...} }
```
**Flow:**
- Component (ProgressTracker, Dashboard) → useLearning hook → learningStore.fetchLearningProgress()
- URL: `/api/user/{userId}/progress`
- Receives: { totalHours, totalActivities, skillsProgressing, completionRate, insights }
- Action: Stores in `stats` section of state

---

## 🔄 Complete User Journey Example

### Journey 1: Job Seeker Registration & Job Application

```
1. User visits /signup
   ├─ Component: SignUpPage
   ├─ Input: email, password, name, "seeker"
   └─ Call: useAuth().signup()
      └─ API: POST /api/auth/signup
         └─ Response: { user, token }
         └─ Action: localStorage.setItem("access_token", token)

2. Redirect to /seeker-dashboard
   ├─ Component: SeekerDashboard
   └─ Call: useJobs().fetchMatchedJobs(userId)
      └─ API: GET /api/jobs/matches/{userId}
         └─ Response: { matchedJobs, totalMatches }

3. User browses jobs
   ├─ Component: BrowseJobsPage
   ├─ Input: skill filter, experience level
   └─ Call: useJobs().fetchAllJobs({ filters })
      └─ API: GET /api/jobs?skills=React&experience=junior
         └─ Response: { jobs }

4. User clicks job detail
   ├─ Component: JobDetailModal
   ├─ Call 1: useJobs().fetchJobDetails(jobId)
   │  └─ API: GET /api/jobs/{jobId}
   ├─ Call 2: useJobs().analyzeSkillGap(jobId, userId)
   │  └─ API: GET /api/jobs/{jobId}/skill-gap/{userId}
   │     └─ Response: { missingSkills, presentSkills }
   └─ Display: Job details + skill gap analysis

5. User applies for job
   ├─ Component: JobDetailModal - Apply Button
   ├─ Input: Cover letter (optional)
   └─ Call: useJobs().applyForJob(jobId, userId, "I'm interested...")
      └─ API: POST /api/jobs/{jobId}/apply
         └─ Response: { applicationId, status }
         └─ Action: Add to appliedJobs array, show success toast

6. User uploads resume
   ├─ Component: UploadResumePage
   ├─ Input: Resume PDF file
   └─ Call: useResume().uploadResume(file, userId)
      └─ API: POST /api/resume/upload
         └─ Response: { resumeId, filename }
         └─ Auto-triggers: extractSkills API call

7. Skills auto-extracted
   └─ API: POST /api/resume/extract-skills
      └─ Response: { skills: ["Python", "React", ...] }
      └─ Updates: userStore with extracted skills
```

### Journey 2: Job Provider Posting & Browsing Candidates

```
1. Provider logs in
   └─ API: POST /api/auth/login + redirect to /provider-dashboard

2. Provider posts job
   ├─ Component: PostJobPage
   ├─ Input: title, description, requiredSkills, salary, location
   └─ Call: useJobs().postJob({ jobData })
      └─ API: POST /api/jobs/post
         └─ Response: { jobId, createdAt }

3. Provider views own postings
   ├─ Component: MyPostingsPage
   └─ Call: useJobs().fetchProviderJobs(providerId)
      └─ API: GET /api/jobs/provider/{providerId}
         └─ Response: { jobs: [...], applicant counts }

4. Provider finds candidates
   ├─ Component: FindCandidatesPage
   └─ Call: useJobs().fetchMatchedJobs(jobId, {reversed: true})
      └─ API: GET /api/candidates/matches/{jobId}
         └─ Response: { candidates, matchScores }
```

---

## 🛡️ Error Handling & Notifications

All API errors are handled by Axios interceptor in `src/utils/api.js`:

```javascript
// Automatic error notifications via react-toastify:

401 → "Session expired. Please login again." + redirect to /login
403 → "Forbidden - insufficient permissions."
404 → "Resource not found."
500 → "Server error. Backend service might be down."
Network Error → "Unable to connect to server."

// All components get errors via:
const { error } = useAuth() // or useJobs(), useResume(), etc.
// Display error in UI or toast
```

---

## 📝 API Request Headers

All API requests automatically include:

```
GET /api/jobs
Host: http://localhost:5000
Content-Type: application/json
Authorization: Bearer {access_token}
```

Except file uploads which use `multipart/form-data`:

```
POST /api/resume/upload
Content-Type: multipart/form-data
Authorization: Bearer {access_token}
```

---

## 🔗 Summary: All 27 API Endpoints

| # | Method | Endpoint | Purpose | Store |
|---|--------|----------|---------|-------|
| 1 | POST | /api/auth/login | User login | authStore |
| 2 | POST | /api/auth/signup | User registration | authStore |
| 3 | PUT | /api/user/profile | Update user profile | authStore |
| 4 | GET | /api/user/profile/{userId} | Fetch user profile | userStore |
| 5 | PUT | /api/user/profile/{userId} | Update user profile | userStore |
| 6 | POST | /api/resume/upload | Upload resume file | resumeStore |
| 7 | GET | /api/resume/{resumeId} | Fetch resume | resumeStore |
| 8 | GET | /api/user/{userId}/resumes | Fetch all user resumes | resumeStore |
| 9 | DELETE | /api/resume/{resumeId} | Delete resume | resumeStore |
| 10 | POST | /api/resume/extract-skills | Extract skills via LLM | resumeStore |
| 11 | GET | /api/jobs | Browse all jobs | jobStore |
| 12 | GET | /api/jobs/matches/{userId} | Get matched jobs | jobStore |
| 13 | GET | /api/jobs/{jobId} | Get job details | jobStore |
| 14 | POST | /api/jobs/{jobId}/apply | Apply for job | jobStore |
| 15 | GET | /api/user/{userId}/applications | Fetch applications | jobStore |
| 16 | POST | /api/jobs/post | Post new job | jobStore |
| 17 | PUT | /api/jobs/{jobId} | Update job | jobStore |
| 18 | DELETE | /api/jobs/{jobId} | Delete job | jobStore |
| 19 | GET | /api/jobs/{jobId}/skill-gap/{userId} | Analyze skill gap | jobStore |
| 20 | GET | /api/jobs/provider/{providerId} | Fetch provider jobs | jobStore |
| 21 | POST | /api/learning-plan/generate | Generate learning plan | learningStore |
| 22 | GET | /api/user/{userId}/learning-plans | Fetch learning plans | learningStore |
| 23 | GET | /api/learning-plan/{planId} | Fetch plan details | learningStore |
| 24 | PUT | /api/learning-plan/{planId} | Update learning plan | learningStore |
| 25 | DELETE | /api/learning-plan/{planId} | Delete learning plan | learningStore |
| 26 | POST | /api/learning-activity/log | Log activity | learningStore |
| 27 | GET | /api/user/{userId}/activities | Fetch activities | learningStore |
| 28 | GET | /api/user/{userId}/achievements | Fetch achievements | learningStore |
| 29 | GET | /api/user/{userId}/progress | Fetch progress stats | learningStore |

---

## 🚀 Next Steps for Backend Implementation

1. **Create Node.js server** with Express.js
2. **Implement all 29 endpoints** following this specification
3. **Integrate with FastAPI** for:
   - `/api/resume/extract-skills` (LLM skill extraction)
   - `/api/learning-plan/generate` (LLM personalized planning)
4. **Set up Redis** for JWT token refresh mechanism
5. **Database schema** for users, jobs, applications, learning plans, activities
6. **Authentication** system with JWT token generation/validation

---

**Last Updated:** March 27, 2026  
**Frontend Version:** 1.0.0  
**Backend Status:** Pending Implementation
