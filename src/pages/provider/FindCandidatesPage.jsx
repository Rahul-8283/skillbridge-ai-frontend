import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, MapPin, Briefcase, GraduationCap, CheckCircle, XCircle } from "lucide-react";
import Footer from "../../components/Footer";

export default function FindCandidatesPage() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hiredEmails, setHiredEmails] = useState(new Set());
  const [rejectedEmails, setRejectedEmails] = useState(new Set());

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Get all registered users who are job seekers
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const seekers = registeredUsers.filter((u) => u.role === "job-seeker");

    // Get hired and rejected candidates for this provider
    const hiredCandidates = JSON.parse(localStorage.getItem("hiredCandidates")) || [];
    const rejectedCandidates = JSON.parse(localStorage.getItem("rejectedCandidates")) || [];

    const hired = new Set(
      hiredCandidates
        .filter((h) => h.providerId === user?.email)
        .map((h) => h.candidateEmail)
    );
    const rejected = new Set(
      rejectedCandidates
        .filter((r) => r.providerId === user?.email)
        .map((r) => r.candidateEmail)
    );

    setHiredEmails(hired);
    setRejectedEmails(rejected);

    // Enrich with profile data
    const enrichedCandidates = seekers.map((seeker) => {
      const profileKey = `${seeker.email}_profile`;
      const profile = JSON.parse(localStorage.getItem(profileKey)) || {};
      return {
        ...seeker,
        profile,
      };
    });

    setCandidates(enrichedCandidates);
    setFilteredCandidates(enrichedCandidates);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(term) ||
        candidate.email.toLowerCase().includes(term) ||
        candidate.profile?.skills?.toLowerCase().includes(term) ||
        candidate.profile?.location?.toLowerCase().includes(term)
    );

    setFilteredCandidates(filtered);
  };

  const handleAccept = (candidateEmail) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const hiredCandidates = JSON.parse(localStorage.getItem("hiredCandidates")) || [];

    if (!hiredCandidates.find((h) => h.candidateEmail === candidateEmail && h.providerId === user.email)) {
      hiredCandidates.push({
        providerId: user.email,
        candidateEmail,
        hiredDate: new Date().toISOString(),
      });
      localStorage.setItem("hiredCandidates", JSON.stringify(hiredCandidates));
    }

    setHiredEmails((prev) => new Set([...prev, candidateEmail]));
  };

  const handleReject = (candidateEmail) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const rejectedCandidates = JSON.parse(localStorage.getItem("rejectedCandidates")) || [];

    if (!rejectedCandidates.find((r) => r.candidateEmail === candidateEmail && r.providerId === user.email)) {
      rejectedCandidates.push({
        providerId: user.email,
        candidateEmail,
        rejectedDate: new Date().toISOString(),
      });
      localStorage.setItem("rejectedCandidates", JSON.stringify(rejectedCandidates));
    }

    setRejectedEmails((prev) => new Set([...prev, candidateEmail]));
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
          <p className="text-sm text-gray-400 mt-3">
            Found {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredCandidates.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((candidate) => (
                <div
                  key={candidate.email}
                  className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{candidate.name}</h3>
                        <p className="text-xs text-gray-400">Job Seeker</p>
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
                          <p className="text-xs font-semibold text-gray-400 mb-2">
                            Skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {candidate.profile.skills
                              .split(",")
                              .slice(0, 3)
                              .map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-xs bg-blue-600/20 border border-blue-500/30 rounded text-blue-300"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                            {candidate.profile.skills.split(",").length > 3 && (
                              <span className="px-2 py-1 text-xs text-gray-400">
                                +{candidate.profile.skills.split(",").length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Salary Expectation */}
                      {candidate.profile.salaryExpectation && (
                        <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                          <p className="text-xs font-semibold text-gray-400 mb-1">
                            Salary Expectation
                          </p>
                          <p className="text-sm text-blue-300 font-semibold">
                            {candidate.profile.salaryExpectation}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => handleAccept(candidate.email)}
                      disabled={hiredEmails.has(candidate.email)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2 ${
                        hiredEmails.has(candidate.email)
                          ? "bg-green-600/20 border border-green-500/30 text-green-300 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{hiredEmails.has(candidate.email) ? "Accepted" : "Accept"}</span>
                    </button>
                    <button
                      onClick={() => handleReject(candidate.email)}
                      disabled={rejectedEmails.has(candidate.email)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2 ${
                        rejectedEmails.has(candidate.email)
                          ? "bg-red-600/20 border border-red-500/30 text-red-300 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{rejectedEmails.has(candidate.email) ? "Rejected" : "Reject"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                {searchTerm
                  ? "No candidates found matching your search"
                  : "No candidates available yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
