import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";
import Footer from "../../components/Footer";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function JobApplicationsPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);

  useEffect(() => {
    loadApplications();
  }, [jobId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      // Optional: fetch job details
      try {
         const jobRes = await api.get(`/jobs/${jobId}`);
         setJob(jobRes.data);
      } catch(e) {}
      
      const res = await api.get(`/jobs/${jobId}/applications`);
      setApplications(res.data || []);
    } catch (err) {
      console.error("Error loading applications:", err);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.put(`/jobs/applications/${appId}/status`, { status: newStatus });
      toast.success(`Application marked as ${newStatus}`);
      loadApplications();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update application status");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white pb-20">
        <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/provider-dashboard/my-postings")}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Job Postings</span>
            </button>
            <h1 className="text-4xl font-bold mb-2">Applicants</h1>
            <p className="text-gray-400">
              Review candidates who applied for: <span className="text-white font-semibold">{job?.title || 'This Job'}</span>
            </p>
          </div>
        </div>

        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
              <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Applicants Yet</h2>
              <p className="text-slate-400">There are currently no applications for this position.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{app.userId?.name || 'Applicant'}</h3>
                      <p className="text-blue-400 flex items-center mb-2">
                        <Mail className="w-4 h-4 mr-2" />
                        {app.userId?.email || 'N/A'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      app.status === 'pending' ? 'text-amber-400 bg-amber-400/10 border-amber-500/20' :
                      app.status === 'accepted' ? 'text-green-400 bg-green-400/10 border-green-500/20' :
                      'text-red-400 bg-red-400/10 border-red-500/20'} uppercase tracking-wider`}>
                      {app.status || 'pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-400 mt-4 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </div>
                    {app.resumeId && (
                      <span className="text-blue-400 text-xs px-2 py-1 rounded bg-blue-400/10">Resume Attached</span>
                    )}
                  </div>
                  
                  {app.resumeId?.skills?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                       <p className="text-xs text-gray-400 mb-2 font-semibold">Matched Skills:</p>
                       <div className="flex flex-wrap gap-1.5">
                         {app.resumeId.skills.slice(0, 10).map((skill, i) => (
                           <span key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-gray-300">
                             {skill}
                           </span>
                         ))}
                         {app.resumeId.skills.length > 10 && <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-gray-400">+{app.resumeId.skills.length - 10} more</span>}
                       </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-800">
                     <button
                       onClick={() => handleStatusUpdate(app._id, 'pending')}
                       disabled={app.status === 'pending'}
                       className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${app.status === 'pending' ? 'bg-slate-800 text-gray-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700'}`}
                     >
                       Mark Pending
                     </button>
                     <button
                       onClick={() => handleStatusUpdate(app._id, 'rejected')}
                       disabled={app.status === 'rejected'}
                       className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors ${app.status === 'rejected' ? 'bg-red-900/20 text-red-700 cursor-not-allowed' : 'bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400'}`}
                     >
                       <XCircle className="w-4 h-4 mr-2" /> Reject
                     </button>
                     <button
                       onClick={() => handleStatusUpdate(app._id, 'accepted')}
                       disabled={app.status === 'accepted'}
                       className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors ${app.status === 'accepted' ? 'bg-green-900/20 text-green-700 cursor-not-allowed' : 'bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400'}`}
                     >
                       <CheckCircle className="w-4 h-4 mr-2" /> Shortlist / Hire
                     </button>
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
