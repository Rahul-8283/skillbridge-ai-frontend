import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Edit2, Eye, Calendar, Briefcase, MapPin, DollarSign } from "lucide-react";

export default function MyPostingsPage() {
  const navigate = useNavigate();
  const [postings, setPostings] = useState([]);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    loadPostings();
  }, []);

  const loadPostings = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    const allPostings = JSON.parse(localStorage.getItem("jobPostings")) || [];
    const userPostings = allPostings.filter((job) => job.postedBy === user.email);
    setPostings(userPostings);
  };

  const deletePosting = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      const allPostings = JSON.parse(localStorage.getItem("jobPostings")) || [];
      const updatedPostings = allPostings.filter((job) => job.id !== jobId);
      localStorage.setItem("jobPostings", JSON.stringify(updatedPostings));
      loadPostings();
      alert("Job posting deleted successfully!");
    }
  };

  const toggleStatus = (jobId) => {
    const allPostings = JSON.parse(localStorage.getItem("jobPostings")) || [];
    const updated = allPostings.map((job) => {
      if (job.id === jobId) {
        return {
          ...job,
          status: job.status === "active" ? "closed" : "active",
        };
      }
      return job;
    });
    localStorage.setItem("jobPostings", JSON.stringify(updated));
    loadPostings();
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-600/20 text-green-400 border-green-500/30"
      : "bg-gray-600/20 text-gray-400 border-gray-500/30";
  };

  const filteredPostings = postings.filter((posting) => {
    if (filter === "active") return posting.status === "active";
    if (filter === "closed") return posting.status === "closed";
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/provider-dashboard")}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Job Postings</h1>
              <p className="text-gray-400">
                Manage and track your active job postings
              </p>
            </div>
            <button
              onClick={() => navigate("/provider-dashboard/post-job")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              + Post New Job
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4">
            {["all", "active", "closed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  filter === tab
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                }`}
              >
                {tab} ({postings.filter((p) => tab === "all" || p.status === tab).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Job Postings */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredPostings.length > 0 ? (
            <div className="space-y-6">
              {filteredPostings.map((posting) => (
                <div
                  key={posting.id}
                  className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all"
                >
                  {/* Top Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        {posting.jobTitle}
                      </h3>
                      <p className="text-gray-400">{posting.companyName}</p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(
                        posting.status
                      )}`}
                    >
                      {posting.status === "active" ? "Active" : "Closed"}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-slate-800">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">
                        {posting.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-gray-300">
                        {posting.salary}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-300 capitalize">
                        {posting.jobType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">
                        Posted {formatDate(posting.postedDate)}
                      </span>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <div className="mb-6">
                    <p className="text-gray-300 line-clamp-2">
                      {posting.description}
                    </p>
                  </div>

                  {/* Deadline */}
                  <div className="mb-6 p-3 bg-slate-800 rounded-lg">
                    <p className="text-xs font-semibold text-gray-400 mb-1">
                      Application Deadline
                    </p>
                    <p className="text-sm text-blue-300">
                      {formatDate(posting.deadline)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors">
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => toggleStatus(posting.id)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        posting.status === "active"
                          ? "bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300"
                          : "bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300"
                      }`}
                    >
                      {posting.status === "active" ? "Close Posting" : "Reopen"}
                    </button>
                    <button
                      onClick={() => deletePosting(posting.id)}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-6">
                {postings.length === 0
                  ? "You haven't posted any jobs yet"
                  : "No postings match your filter"}
              </p>
              {postings.length === 0 && (
                <button
                  onClick={() => navigate("/provider-dashboard/post-job")}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                >
                  Post Your First Job
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
