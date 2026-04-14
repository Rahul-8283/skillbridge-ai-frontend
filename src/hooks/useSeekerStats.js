import { useState, useCallback } from "react";
import api from "../utils/api";

export const useSeekerStats = (user) => {
  const [profileCompletion, setProfileCompletion] = useState("0%");
  const [statsData, setStatsData] = useState({
    applications: "0",
    matches: "0",
    interviews: "0",
  });
  const [loading, setLoading] = useState(false);

  // Calculate profile completion
  const calculateProfileCompletion = useCallback(async () => {
    if (user) {
      try {
        const res = await api.get("/seeker/profile");
        const profile = res.data || {};
        const fields = ["resume", "skills", "experience", "education", "location"];
        const filledFields = fields.filter(
          (field) => profile[field] && String(profile[field]).trim().length > 0
        );
        const completion = Math.round((filledFields.length / fields.length) * 100);
        setProfileCompletion(`${completion}%`);
      } catch (err) {
        console.error("Error fetching profile for completion:", err);
        setProfileCompletion("0%");
      }
    }
  }, [user]);

  // Fetch all stats from backend
  const fetchStats = useCallback(async () => {
    const uId = user?._id || user?.id;
    if (!uId) return;

    setLoading(true);
    try {
      console.log("📊 Fetching seeker stats...");
      
      const appsRes = await api.get(`/user/${uId}/applications`);
      const matchesRes = await api.get(`/jobs/matches/${uId}`);
      
      const allApps = appsRes.data || [];
      const acceptedApps = allApps.filter(app => app.status === 'accepted');
      
      const newStats = {
        applications: allApps.length.toString() || "0",
        matches: matchesRes.data?.matches?.length?.toString() || "0",
        interviews: acceptedApps.length.toString() || "0",
      };
      
      console.log("✅ Stats fetched:", newStats);
      setStatsData(newStats);
    } catch (err) {
      console.error("❌ Error fetching stats:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refetch everything - this is called after actions
  const refetchStats = useCallback(async () => {
    console.log("🔄 Refetching all seeker stats...");
    await calculateProfileCompletion();
    await fetchStats();
  }, [fetchStats, calculateProfileCompletion]);

  return {
    statsData,
    profileCompletion,
    loading,
    refetchStats,
    fetchStats,
    calculateProfileCompletion,
  };
};
