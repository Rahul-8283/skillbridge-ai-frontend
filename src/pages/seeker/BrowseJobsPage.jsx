import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Heart,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Footer from "../../components/Footer";
import api from "../../utils/api";
import { useLearning } from "../../hooks/useLearning";
import { toast } from "react-toastify";

export default function BrowseJobsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [savedJobs, setSavedJobs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applying, setApplying] = useState(null);
  const { generateLearningPlan } = useLearning();

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      // 1. Apply for the job
      await api.post(`/jobs/${jobId}/apply`);
      console.log('✅ Applied to job successfully');
      
      // 2. Refetch jobs to get latest data from database
      await loadJobs();
      
      // 3. Trigger stats refresh in parent (SeekerDashboard)
      window.dispatchEvent(new CustomEvent('seekerStatsRefresh'));
      
      // 4. Generate roadmap for this job
      toast.info("Application successful! Generating custom learning roadmap...", { autoClose: 3000 });
      const planRes = await generateLearningPlan(jobId, 2);
      
      if (!planRes.success) {
        throw new Error(planRes.error || "Failed to generate learning roadmap");
      }
      
      toast.success("Learning plan generated successfully!");
      navigate("/dashboard/learning-plan");
    } catch (err) {
      if (err.message === "You have already applied for this job") {
         toast.info("You have already applied. Generating roadmap directly...");
         const planRes = await generateLearningPlan(jobId, 2);
         if (!planRes.success) {
           toast.error(planRes.error || "Failed to generate learning roadmap");
           return;
         }
         navigate("/dashboard/learning-plan");
      } else {
         toast.error(err.message || "Failed to apply for the job");
      }
    } finally {
      setApplying(null);
    }
  };

  useEffect(() => {
    loadJobs();
    loadSavedJobs();
  }, []);

  const loadJobs = async () => {
    try {
      console.log('📋 Loading jobs from database...');
      const res = await api.get("/jobs");
      const activeJobs = res.data || [];
      console.log('✅ Fetched', activeJobs.length, 'jobs');
      
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log('📊 Fetching job matches for user:', user._id);
        const matchRes = await api.get(`/jobs/matches/${user._id || user.id}`);
        const matchData = matchRes.data?.matches || [];
        console.log('✅ Found', matchData.length, 'matching jobs');
        setMatches(matchData);
        
        // Merge match data into jobs
        const enrichedJobs = activeJobs.map(job => {
          const match = matchData.find(m => m.job_id === job._id || m.job_id === job._id.toString());
          return {
            ...job,
            matchScore: match ? Math.round(Number(match.score) * 100) : null,
            missingSkills: match ? match.missing_skills : []
          };
        });
        setJobs(enrichedJobs);
        setFilteredJobs(enrichedJobs);
      } catch(err) {
        console.warn("⚠️ Matches not available:", err.message);
        setJobs(activeJobs);
        setFilteredJobs(activeJobs);
      }
      
      // Fetch user's existing applications
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          const appsRes = await api.get(`/user/${user._id || user.id}/applications`);
          const appliedJobIds = (appsRes.data || []).map(app => app.jobId?._id || app.jobId);
          setAppliedJobs(appliedJobIds);
        }
      } catch (err) {
        console.warn("⚠️ Could not load applications:", err.message);
      }
    } catch (err) {
      console.error("❌ Error loading jobs:", err.message);
    }
  };

  const loadSavedJobs = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const saved =
        JSON.parse(localStorage.getItem(`${user.email}_saved_jobs`)) || [];
      setSavedJobs(saved);
    }
  };

  useEffect(() => {
    let filtered = jobs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          (job.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.company?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.location?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply job type filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((job) => job.type?.toLowerCase() === selectedFilter.toLowerCase());
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedFilter, jobs]);

  const toggleSaveJob = (jobId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to save jobs");
      return;
    }

    const isSaved = savedJobs.includes(jobId);
    let newSavedJobs;

    if (isSaved) {
      newSavedJobs = savedJobs.filter((id) => id !== jobId);
    } else {
      newSavedJobs = [...savedJobs, jobId];
    }

    setSavedJobs(newSavedJobs);
    localStorage.setItem(
      `${user.email}_saved_jobs`,
      JSON.stringify(newSavedJobs)
    );
  };

  const JobCard = ({ job }) => {
    const isSaved = savedJobs.includes(job._id);
    const hasApplied = appliedJobs.includes(job._id);

    return (
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden">
        {job.matchScore && job.matchScore > 70 && (
          <div className="absolute top-0 right-0">
            <div className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg transform uppercase tracking-wider">
              Recommended
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-bold text-white">
                {job.title}
              </h3>
              {job.matchScore && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  job.matchScore >= 80 ? 'bg-green-500/20 text-green-400' : 
                  job.matchScore >= 50 ? 'bg-blue-500/20 text-blue-400' : 
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {job.matchScore}% Match
                </span>
              )}
            </div>
            <p className="text-gray-400">{job.company}</p>
          </div>
          <button
            onClick={() => toggleSaveJob(job._id)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isSaved
                ? "bg-red-500/20 text-red-400"
                : "bg-slate-800 text-gray-400 hover:bg-slate-700"
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        <p className="text-gray-400 mb-4 line-clamp-2">{job.description}</p>

        {job.missingSkills?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-blue-400/80 mb-2 font-semibold">Missing Skills:</p>
            <div className="flex flex-wrap gap-1.5">
              {job.missingSkills.map((skill, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-500/5 border border-blue-500/20 rounded text-[10px] text-blue-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">${job.salary}/year</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Briefcase className="w-4 h-4" />
            <span className="capitalize">{job.type}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button 
            onClick={() => handleApply(job._id)}
            disabled={applying === job._id || hasApplied}
            className={`w-full py-2 px-4 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
              hasApplied ? 'bg-green-600/20 text-green-400 cursor-not-allowed' :
              applying === job._id ? 'bg-slate-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {hasApplied ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Applied</span>
              </>
            ) : applying === job._id ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Applying & Generating...</span>
              </>
            ) : (
              <span>Apply Now</span>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold mb-2">Browse Jobs</h1>
          <p className="text-gray-400">
            Discover perfectly matched job opportunities tailored for you
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-gray-400 hover:bg-slate-800"
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => setSelectedFilter("full-time")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedFilter === "full-time"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-gray-400 hover:bg-slate-800"
              }`}
            >
              Full Time
            </button>
            <button
              onClick={() => setSelectedFilter("part-time")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedFilter === "part-time"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-gray-400 hover:bg-slate-800"
              }`}
            >
              Part Time
            </button>
            <button
              onClick={() => setSelectedFilter("contract")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedFilter === "contract"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-gray-400 hover:bg-slate-800"
              }`}
            >
              Contract
            </button>
          </div>

          {/* Results Count */}
          <div className="text-gray-400">
            Found {filteredJobs.length} job
            {filteredJobs.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {filteredJobs.length > 0 ? (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No jobs found</p>
              <p className="text-gray-500">
                Try adjusting your search filters
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
