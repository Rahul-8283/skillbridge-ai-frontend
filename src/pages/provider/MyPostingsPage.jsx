import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Edit2, Eye, Calendar, Briefcase, MapPin, DollarSign, X, Loader2, Users } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function MyPostingsPage() {
  const navigate = useNavigate();
  const [postings, setPostings] = useState([]);
  const [filter, setFilter] = useState("active");
  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    loadPostings();
  }, []);

  const [loading, setLoading] = useState(false);

  const loadPostings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/provider/my-jobs");
      const myJobs = res.data || [];
      setPostings(myJobs);
    } catch (err) {
      console.error("Error loading postings:", err);
      toast.error("Failed to load job postings");
    } finally {
      setLoading(false);
    }
  };

  const deletePosting = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await api.delete(`/jobs/${jobId}`);
        toast.success("Job posting deleted successfully!");
        loadPostings();
      } catch (err) {
        console.error("Error deleting posting:", err);
        toast.error("Failed to delete job posting");
      }
    }
  };

  const toggleStatus = async (jobId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "closed" : "active";
      await api.put(`/jobs/${jobId}`, { status: newStatus });
      toast.success(`Job ${newStatus === "active" ? "reopened" : "closed"} successfully!`);
      loadPostings();
    } catch (err) {
      console.error("Error toggling status:", err);
      toast.error("Failed to update job status");
    }
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

  const handleEditClick = (posting) => {
    setEditingJob(posting);
    setEditFormData({ ...posting });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/jobs/${editingJob._id}`, editFormData);
      toast.success("Job posting updated successfully!");
      setEditingJob(null);
      setEditFormData(null);
      loadPostings();
    } catch (err) {
      console.error("Error updating posting:", err);
      toast.error("Failed to update job posting");
    }
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
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${filter === tab
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
                  key={posting._id}
                  className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all"
                >
                  {/* Top Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        {posting.title}
                      </h3>
                      <p className="text-gray-400">{posting.company}</p>
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
                        {posting.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">
                        Posted {formatDate(posting.createdAt)}
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
                    <button
                      onClick={() => navigate(`/provider-dashboard/job/${posting._id}/applications`)}
                      className="px-4 py-2 bg-slate-800 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors text-sm font-medium"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      View Applicants
                    </button>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleEditClick(posting)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => toggleStatus(posting._id, posting.status)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${posting.status === "active"
                          ? "bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300"
                          : "bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300"
                        }`}
                    >
                      {posting.status === "active" ? "Close Posting" : "Reopen"}
                    </button>
                    <button
                      onClick={() => deletePosting(posting._id)}
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

      {/* Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit Job Posting</h2>
              <button
                onClick={() => setEditingJob(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-semibold mb-3">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData?.title || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold mb-3">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={editFormData?.company || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-3">Description</label>
                <textarea
                  name="description"
                  value={editFormData?.description || ""}
                  onChange={handleEditChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-semibold mb-3">Requirements</label>
                <textarea
                  name="skillsRequired"
                  value={Array.isArray(editFormData?.skillsRequired) ? editFormData.skillsRequired.join('\n') : (editFormData?.skillsRequired || "")}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-semibold mb-3">Salary Range</label>
                <input
                  type="text"
                  name="salary"
                  value={editFormData?.salary || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold mb-3">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editFormData?.location || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Grid for selects */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={editFormData?.experienceLevel || "entry"}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Job Type</label>
                  <select
                    name="type"
                    value={editFormData?.type || "Full-time"}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="Full-time">Full Time</option>
                    <option value="Part-time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-semibold mb-3">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={editFormData?.deadline?.split("T")[0] || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
