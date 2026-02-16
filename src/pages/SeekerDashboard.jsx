import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import SeekerHeader from "../components/seeker/SeekerHeader.jsx";
import SeekerStats from "../components/seeker/SeekerStats.jsx";
import SeekerActions from "../components/seeker/SeekerActions.jsx";
import ProfileCompletion from "../components/seeker/ProfileCompletion.jsx";

export default function SeekerDashboard() {
  const [user, setUser] = useState(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === "job-seeker") {
        setUser(userData);
      } else {
        navigate("/provider-dashboard");
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
          <SeekerHeader user={user} />
          <SeekerStats user={user} />
          <SeekerActions />
          <ProfileCompletion user={user} />
        </div>
      </div>
      <Footer />
    </>
  );
}
