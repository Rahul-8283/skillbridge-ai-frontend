import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Heart,
} from "lucide-react";
import Footer from "../../components/Footer";

export default function BrowseJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    loadJobs();
    loadSavedJobs();
  }, []);

  const loadJobs = () => {
    const jobPostings = JSON.parse(localStorage.getItem("jobPostings")) || [];
    const activeJobs = jobPostings.filter((job) => job.status === "active");
    setJobs(activeJobs);
    setFilteredJobs(activeJobs);
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
          job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply job type filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((job) => job.jobType === selectedFilter);
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
    const isSaved = savedJobs.includes(job.id);
    return (
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {job.jobTitle}
            </h3>
            <p className="text-gray-400">{job.companyName}</p>
          </div>
          <button
            onClick={() => toggleSaveJob(job.id)}
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

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <DollarSign className="w-4 h-4" />
            <span>${job.salary}/year</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Briefcase className="w-4 h-4" />
            <span className="capitalize">{job.jobType}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{job.experienceLevel}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300">
            Apply Now
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
            onClick={() => navigate("/seeker-dashboard")}
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
                <JobCard key={job.id} job={job} />
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
      <div className="h-20" />
    </div>
  );
}
