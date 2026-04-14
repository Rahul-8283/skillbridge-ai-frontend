import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Calendar, CheckCircle } from "lucide-react";
import Footer from "../../components/Footer";
import api from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/user/${user._id || user.id}/applications`);
      setApplications(res.data || []);
    } catch (err) {
      console.error("Error loading applications:", err);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-400 bg-green-400/10 border-green-500/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-500/20';
      default: return 'text-amber-400 bg-amber-400/10 border-amber-500/20';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white pb-20">
        <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-bold mb-2">My Applications</h1>
            <p className="text-gray-400">Track the status of your job applications</p>
          </div>
        </div>

        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
              <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Applications Yet</h2>
              <p className="text-slate-400 mb-6">You haven't applied to any jobs yet.</p>
              <button
                onClick={() => navigate("/dashboard/browse-jobs")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{app.jobId?.title || 'Unknown Job'}</h3>
                      <p className="text-blue-400 mb-2">{app.jobId?.company || 'Unknown Company'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)} uppercase tracking-wider`}>
                      {app.status || 'reviewing'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-400 mt-4 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
