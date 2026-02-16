import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import SeekerProfileForm from "../components/seeker/profile/SeekerProfileForm.jsx";
import ProviderProfileForm from "../components/provider/profile/ProviderProfileForm.jsx";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>

          {/* Profile Form */}
          {user.role === "job-seeker" ? (
            <SeekerProfileForm user={user} onSave={() => navigate(-1)} />
          ) : (
            <ProviderProfileForm user={user} onSave={() => navigate(-1)} />
          )}
        </div>
      </div>
    </>
  );
}
