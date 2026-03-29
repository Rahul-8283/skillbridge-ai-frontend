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
import api from "../utils/api";

export default function SeekerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      if (isAuthenticated && user) {
        if (user.role === "seeker") {
          try {
            const res = await api.get("/seeker/profile");
            const profile = res.data;
            const isProfileComplete = profile && profile.skills && profile.experience;
            setProfileCompleted(!!isProfileComplete);
          } catch (err) {
            console.error("Error checking profile:", err);
          }
        } else if (user.role === "provider") {
          navigate("/provider-dashboard");
        }
      } else if (!isAuthenticated && !localStorage.getItem("access_token")) {
        navigate("/");
      }
    };
    checkProfile();
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const checkResume = async () => {
      if (isAuthenticated && user) {
        try {
          const res = await api.get("/seeker/resumes");
          if (res.status === "success" && res.data && res.data.length > 0) {
            setResumeUploaded(true);
          } else {
            setResumeUploaded(false);
          }
        } catch (err) {
          console.error("Error checking resume:", err);
          setResumeUploaded(false);
        }
      }
    };
    checkResume();
  }, [isAuthenticated, user]);



  if (!user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white px-4 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <SeekerHeader user={user} />
          <SeekerStats user={user} />
          <SeekerActions resumeUploaded={resumeUploaded} />
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
