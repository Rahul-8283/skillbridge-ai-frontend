import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import ProviderHeader from "../components/provider/ProviderHeader.jsx";
import ProviderStats from "../components/provider/ProviderStats.jsx";
import ProviderActions from "../components/provider/ProviderActions.jsx";
import ProviderCandidates from "../components/provider/ProviderCandidates.jsx";
import ProviderTips from "../components/provider/ProviderTips.jsx";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";

export default function ProviderDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, totalCandidates: 0, hired: 0 });
  const [candidates, setCandidates] = useState([]);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (isAuthenticated && user && user.role === "provider") {
      try {
        // Fetch Profile
        const profileRes = await api.get("/provider/profile");
        const profileData = profileRes.data || {};
        setProfile(profileData);

        // Fetch My Jobs
        const jobsRes = await api.get("/provider/my-jobs");
        const activeJobs = (jobsRes.data || []).filter(j => j.status === 'active' || j.status === 'open').length;
        
        // Fetch Candidates
        const candidatesRes = await api.get("/provider/candidates");
        const candidatesData = candidatesRes.data || [];
        
        setStats({
          activeJobs,
          totalCandidates: candidatesData.length,
          hired: profileData.selectedCandidates?.length || 0
        });
        setCandidates(candidatesData);

      } catch (err) {
        console.error("Error fetching provider data:", err);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "provider") {
        fetchData();
      } else if (user.role === "seeker") {
        navigate("/seeker-dashboard");
      }
    } else if (!isAuthenticated && !localStorage.getItem("access_token")) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);



  if (!user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white px-4 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <ProviderHeader user={user} profile={profile} />
          <ProviderStats stats={stats} />
          <ProviderActions />
          {/* <ProviderCandidates candidates={candidates} onStatusUpdate={fetchData} /> */}
          <ProviderTips />
        </div>
      </div>
      <Footer />
    </>
  );
}
