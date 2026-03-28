import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import SeekerHeader from "../components/seeker/SeekerHeader.jsx";
import SeekerStats from "../components/seeker/SeekerStats.jsx";
import SeekerActions from "../components/seeker/SeekerActions.jsx";
import ProfileCompletion from "../components/seeker/ProfileCompletion.jsx";
import LearningProgressTracker from "../components/seeker/LearningProgressTracker.jsx";
import AchievementBadges from "../components/seeker/AchievementBadges.jsx";
import { useAuth } from "../hooks/useAuth";

export default function SeekerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "seeker") {
        // Check if profile is completed
        const profileKey = `${user.email}_profile`;
        const profile = JSON.parse(localStorage.getItem(profileKey)) || {};
        const isProfileComplete = profile.experienceLevel && profile.preferredRole && profile.skills;
        setProfileCompleted(isProfileComplete);
      } else if (user.role === "provider") {
        navigate("/provider-dashboard");
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
          <SeekerHeader user={user} />
          <SeekerStats user={user} />
          <SeekerActions />
          <div className="hidden md:block">
            <ProfileCompletion user={user} onProfileComplete={() => setProfileCompleted(true)} />
          </div>
          
          {profileCompleted && (
            <>
              <div className="hidden md:block">
                <LearningProgressTracker />
              </div>
              <AchievementBadges />
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
