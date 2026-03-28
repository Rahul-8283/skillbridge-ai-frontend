import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, MapPin, Briefcase, GraduationCap, CheckCircle, XCircle, Eye } from "lucide-react";
import Footer from "../../components/Footer";

export default function FindCandidatesPage() {
  const navigate = useNavigate();
  const [allCandidates, setAllCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [rejectedCandidates, setRejectedCandidates] = useState([]);
  const [unviewedCandidates, setUnviewedCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("unviewed");

  useEffect(() => {
    loadCandidates();
  }, []);

  const [loading, setLoading] = useState(false);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      // 1. Fetch provider profile to get status arrays
      const profileRes = await api.get("/provider/profile");
      const profile = profileRes.data || {};
      const selectedEmails = new Set(profile.selectedCandidates || []);
      const rejectedEmails = new Set(profile.rejectedCandidates || []);

      // 2. Fetch all candidates
      const candidatesRes = await api.get("/provider/candidates");
      const enrichedCandidates = candidatesRes.data || [];

      // 3. Categorize candidates
      const selected = enrichedCandidates.filter((c) => selectedEmails.has(c.email));
      const rejected = enrichedCandidates.filter((c) => rejectedEmails.has(c.email));
      const unviewed = enrichedCandidates.filter(
        (c) => !selectedEmails.has(c.email) && !rejectedEmails.has(c.email)
      );

      setAllCandidates(enrichedCandidates);
      setSelectedCandidates(selected);
      setRejectedCandidates(rejected);
      setUnviewedCandidates(unviewed);
    } catch (err) {
      console.error("Error loading candidates:", err);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (candidateEmail, newStatus) => {
    try {
      await api.put("/provider/candidates/status", { candidateEmail, status: newStatus });
      toast.success(`Candidate moved to ${newStatus}`);
      loadCandidates();
    } catch (err) {
      console.error("Error updating candidate status:", err);
      toast.error("Failed to update candidate status");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filterCandidates = (candidates) => {
    if (!searchTerm) return candidates;
    return candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(searchTerm) ||
        candidate.email.toLowerCase().includes(searchTerm) ||
        candidate.profile?.skills?.toLowerCase().includes(searchTerm) ||
        candidate.profile?.location?.toLowerCase().includes(searchTerm)
    );
  };

  const CandidateCard = ({ candidate, status }) => (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{candidate.name}</h3>
            <p className="text-sm text-gray-400">Job Seeker</p>
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center space-x-2 mb-3 text-sm text-gray-300">
        <Mail className="w-4 h-4 text-blue-400" />
        <span className="truncate">{candidate.email}</span>
      </div>

      {/* Profile Info */}
      {candidate.profile && (
        <>
          {candidate.profile.location && (
            <div className="flex items-center space-x-2 mb-3 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-green-400" />
              <span>{candidate.profile.location}</span>
            </div>
          )}

          {candidate.profile.experience && (
            <div className="flex items-center space-x-2 mb-3 text-sm text-gray-300">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>{candidate.profile.experience}</span>
            </div>
          )}

          {candidate.profile.education && (
            <div className="flex items-center space-x-2 mb-3 text-sm text-gray-300">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>{candidate.profile.education}</span>
            </div>
          )}

          {/* Skills */}
          {candidate.profile.skills && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-400 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {candidate.profile.skills
                  .split(",")
                  .slice(0, 3)
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs bg-blue-600/20 border border-blue-500/30 rounded text-blue-300"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                {candidate.profile.skills.split(",").length > 3 && (
                  <span className="px-3 py-1 text-xs text-gray-400">
                    +{candidate.profile.skills.split(",").length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Salary Expectation */}
          {candidate.profile.salaryExpectation && (
            <div className="mb-4 p-3 bg-slate-800 rounded-lg">
              <p className="text-xs font-semibold text-gray-400 mb-1">Salary Expectation</p>
              <p className="text-sm text-blue-300 font-semibold">{candidate.profile.salaryExpectation}</p>
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => updateCandidateStatus(candidate.email, "selected")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2 ${status === "selected"
              ? "bg-green-600/20 border border-green-500/30 text-green-300 cursor-default"
              : "bg-green-600 hover:bg-green-700 text-white"
            }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Select</span>
        </button>
        <button
          onClick={() => updateCandidateStatus(candidate.email, "rejected")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2 ${status === "rejected"
              ? "bg-red-600/20 border border-red-500/30 text-red-300 cursor-default"
              : "bg-red-600 hover:bg-red-700 text-white"
            }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Reject</span>
        </button>
        <button
          onClick={() => updateCandidateStatus(candidate.email, "unviewed")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2 ${status === "unviewed"
              ? "bg-gray-600/20 border border-gray-500/30 text-gray-300 cursor-default"
              : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
        >
          <Eye className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );

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
          <h1 className="text-4xl font-bold mb-2">Find Candidates</h1>
          <p className="text-gray-400">
            Browse and discover talented job seekers on SkillBridge
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <input
            type="text"
            placeholder="Search by name, email, skills, or location..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 flex-wrap">
            <button
              onClick={() => setActiveTab("unviewed")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === "unviewed"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                }`}
            >
              Unviewed ({filterCandidates(unviewedCandidates).length})
            </button>
            <button
              onClick={() => setActiveTab("selected")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === "selected"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                }`}
            >
              Selected ({filterCandidates(selectedCandidates).length})
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === "rejected"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                }`}
            >
              Rejected ({filterCandidates(rejectedCandidates).length})
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === "selected" && (
            <>
              {filterCandidates(selectedCandidates).length > 0 ? (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                  {filterCandidates(selectedCandidates).map((candidate) => (
                    <CandidateCard key={candidate.email} candidate={candidate} status="selected" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No selected candidates</p>
                </div>
              )}
            </>
          )}

          {activeTab === "rejected" && (
            <>
              {filterCandidates(rejectedCandidates).length > 0 ? (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                  {filterCandidates(rejectedCandidates).map((candidate) => (
                    <CandidateCard key={candidate.email} candidate={candidate} status="rejected" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No rejected candidates</p>
                </div>
              )}
            </>
          )}

          {activeTab === "unviewed" && (
            <>
              {filterCandidates(unviewedCandidates).length > 0 ? (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                  {filterCandidates(unviewedCandidates).map((candidate) => (
                    <CandidateCard key={candidate.email} candidate={candidate} status="unviewed" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No unviewed candidates</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
