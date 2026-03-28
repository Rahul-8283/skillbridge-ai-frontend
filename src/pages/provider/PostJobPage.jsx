import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function PostJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    experienceLevel: "entry",
    jobType: "full-time",
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.jobTitle ||
      !formData.companyName ||
      !formData.description ||
      !formData.requirements ||
      !formData.salary ||
      !formData.location ||
      !formData.deadline
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/jobs", formData);
      if (res.status === "success") {
        toast.success("Job posted successfully!");
        navigate("/provider-dashboard");
      }
    } catch (err) {
      console.error("Error posting job:", err);
      toast.error(err.message || "Failed to post job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/provider-dashboard")}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold mb-2">Post a New Job</h1>
          <p className="text-gray-400">
            Fill in the details below to create a new job posting
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 rounded-2xl p-8 border border-slate-800"
          >
            {/* Job Title */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Company Name */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Your company name"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and what makes it unique"
                rows="5"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">
                Key Requirements *
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List the key skills, experience, and qualifications required (one per line)"
                rows="4"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Salary */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">
                Salary Range *
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $80,000 - $120,000 per year"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Location */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Grid for selects */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Experience Level */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Experience Level *
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
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
                <label className="block text-sm font-semibold mb-3">
                  Job Type *
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">
                Application Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-4 bg-gradient-to-b from-blue-600 to-blue-400 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-blue-500 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span>{submitting ? "Posting..." : "Post Job"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
