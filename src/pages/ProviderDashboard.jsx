import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import ProviderHeader from "../components/provider/ProviderHeader.jsx";
import ProviderStats from "../components/provider/ProviderStats.jsx";
import ProviderActions from "../components/provider/ProviderActions.jsx";
import ProviderCandidates from "../components/provider/ProviderCandidates.jsx";
import ProviderTips from "../components/provider/ProviderTips.jsx";

export default function ProviderDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === "job-provider") {
        setUser(userData);
      } else {
        navigate("/seeker-dashboard");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);



  if (!user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white px-4 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <ProviderHeader user={user} />
          <ProviderStats />
          <ProviderActions />
          <ProviderCandidates />
          <ProviderTips />
        </div>
      </div>
      <Footer />
    </>
  );
}
