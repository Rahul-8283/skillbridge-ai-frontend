import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import api from "../../../utils/api";
import { toast } from "react-toastify";

export default function ProviderProfileForm({ user, onSave }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profile, setProfile] = useState({
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    industry: "",
    companySize: "",
    location: "",
    contactEmail: "",
    logo: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/provider/profile");
        if (res.data) {
          setProfile(res.data);
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
      await api.post("/provider/profile", profile);
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
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Edit Job Provider Profile</h2>

      <div className="space-y-6">
        {/* Company Name */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={profile.companyName}
            onChange={handleChange}
            placeholder="e.g., Tech Solutions Inc."
            className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Company Description */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Company Description</label>
          <textarea
            name="companyDescription"
            value={profile.companyDescription}
            onChange={handleChange}
            placeholder="Tell us about your company..."
            rows="4"
            className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Company Website */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Company Website</label>
          <input
            type="url"
            name="companyWebsite"
            value={profile.companyWebsite}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Industry</label>
          <select
            name="industry"
            value={profile.industry}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          >
            <option value="">Select Industry</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Company Size */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Company Size</label>
          <select
            name="companySize"
            value={profile.companySize}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          >
            <option value="">Select Size</option>
            <option value="1-50">1-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
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

        {/* Contact Email */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={profile.contactEmail}
            onChange={handleChange}
            placeholder="hr@example.com"
            className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Company Logo */}
        <div>
          <label className="block text-gray-300 text-sm mb-2 font-semibold">Company Logo URL</label>
          <input
            type="url"
            name="logo"
            value={profile.logo}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full bg-slate-800 text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          />
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
