import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import ProviderHeader from "../components/provider/ProviderHeader.jsx";
import ProviderStats from "../components/provider/ProviderStats.jsx";
import ProviderActions from "../components/provider/ProviderActions.jsx";
import ProviderCandidates from "../components/provider/ProviderCandidates.jsx";
import ProviderTips from "../components/provider/ProviderTips.jsx";
import { useAuth } from "../hooks/useAuth";

export default function ProviderDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "provider") {
        // Provider specific logic if any
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
