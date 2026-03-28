import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import api from "../../../utils/api";
import { toast } from "react-toastify";

export default function SeekerProfileForm({ user, onSave }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profile, setProfile] = useState({
    resume: "",
    skills: "",
    experience: "",
    education: "",
    location: "",
    salaryExpectation: "",
    availability: "immediately",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/seeker/profile");
        if (res.data.data) {
          setProfile(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post("/seeker/profile", profile);
      if (window.innerWidth >= 768) {
        toast.success("Profile saved successfully!");
      }
      if (onSave) onSave();
    } catch (err) {
      console.error("Error saving profile:", err);
      if (window.innerWidth >= 768) {
        toast.error("Failed to save profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto p-8 bg-slate-900 rounded-2xl border border-slate-700"
    >
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Edit Job Seeker Profile</h2>

      <div className="space-y-6">
        {/* Resume */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Resume URL</label>
          <input
            type="text"
            name="resume"
            value={profile.resume}
            onChange={handleChange}
            placeholder="https://example.com/resume.pdf"
            className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Skills (comma-separated)</label>
          <textarea
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="React, JavaScript, Node.js, MongoDB..."
            rows="3"
            className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Years of Experience</label>
          <input
            type="text"
            name="experience"
            value={profile.experience}
            onChange={handleChange}
            placeholder="e.g., 3 years"
            className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Education */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Education</label>
          <textarea
            name="education"
            value={profile.education}
            onChange={handleChange}
            placeholder="e.g., Bachelor's in Computer Science from XYZ University"
            rows="2"
            className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            placeholder="e.g., San Francisco, CA"
            className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Salary Expectation */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Salary Expectation (Annual)</label>
          <input
            type="text"
            name="salaryExpectation"
            value={profile.salaryExpectation}
            onChange={handleChange}
            placeholder="e.g., $80,000 - $120,000"
            className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Availability</label>
          <select
            name="availability"
            value={profile.availability}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          >
            <option value="immediately">Available Immediately</option>
            <option value="2weeks">2 Weeks Notice</option>
            <option value="1month">1 Month Notice</option>
            <option value="2months">2 Months Notice</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading || fetching}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{loading ? "Saving..." : "Save Profile"}</span>
        </button>
      </div>
    </motion.div>
  );
}
