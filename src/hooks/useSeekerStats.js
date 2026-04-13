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
  const calculateProfileCompletion = useCallback(() => {
    if (user) {
      const storedProfile = localStorage.getItem(`${user.email}_profile`);
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        const fields = ["resume", "skills", "experience"];
        const filledFields = fields.filter(
          (field) => profile[field] && profile[field].trim().length > 0
        );
        const completion = Math.round((filledFields.length / fields.length) * 100);
        setProfileCompletion(`${completion}%`);
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
      
      const newStats = {
        applications: appsRes.data?.length?.toString() || "0",
        matches: matchesRes.data?.matches?.length?.toString() || "0",
        interviews: "0",
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
    calculateProfileCompletion();
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
