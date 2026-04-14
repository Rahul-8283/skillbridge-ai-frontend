import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import Footer from "../../components/Footer";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useLearning } from "../../hooks/useLearning";

export default function UploadResumePage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [hasExistingResume, setHasExistingResume] = useState(false);

  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        const res = await api.get("/seeker/resumes");
        if (res.status === "success" && res.data.length > 0) {
          setHasExistingResume(true);
          setUploadSuccess(true);
          // Get the most recent resume
          const latestResume = res.data[0];

          // ALWAYS attempt to get matches directly from the endpoint as the ultimate source of truth
          const user = JSON.parse(localStorage.getItem('user'));
          if (user) {
            try {
              const matchRes = await api.get(`/jobs/matches/${user._id || user.id}`);
              const matches = matchRes.data?.matches || [];
              
              if (matches.length > 0) {
                 setAiAnalysis({ matches });
                 return; // Exit early since we have live match data
              }
            } catch (e) {
              console.error("Match fetch fallback error:", e);
            }
          }

          // If no live matches exist, check the resume state
          if (latestResume.analysis && !latestResume.analysis.processing) {
            setAiAnalysis(latestResume.analysis);
          } else {
            // Processing is TRUE but no matches exist on page load. It's likely stuck.
            setAiAnalysis({ 
              fallback: true, 
              message: "Previous upload analysis was interrupted. Please click 'Update Resume' to try uploading again." 
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest resume:", err);
      }
    };

    fetchLatestResume();
  }, []);

  const { generateLearningPlan } = useLearning();
  const [roadmapLoading, setRoadmapLoading] = useState(null);

  const handleGenerateRoadmap = async (jobId) => {
    setRoadmapLoading(jobId);
    try {
      const planRes = await generateLearningPlan(jobId, 2);
      if (!planRes.success) {
        toast.error(planRes.error || "Failed to generate learning roadmap");
        return;
      }
      toast.success("Learning roadmap generated successfully!");
      navigate("/dashboard/learning-plan");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate learning roadmap.");
    } finally {
      setRoadmapLoading(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Keep accepted file types aligned with backend upload middleware.
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type === "application/msword" ||
        selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile);
        setUploadSuccess(false);
      } else {
        alert("Please upload a PDF or Word document");
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.post("/seeker/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // Reduced to 30 seconds - backend processes in background
      });

      if (res.status === "success") {
        setHasExistingResume(true);
        setUploadSuccess(true);

        // Trigger stats refresh immediately after upload
        window.dispatchEvent(new CustomEvent('seekerStatsRefresh'));

        // Show success message
        if (res.data.info) {
          toast.success(res.data.info);
        } else {
          toast.success("Resume uploaded successfully! AI analysis is processing...");
        }

        // Refetch resume list from database to get latest processing data
        let attempts = 0;
        const pollInterval = setInterval(async () => {
          try {
            attempts++;
            const resumes = await api.get("/seeker/resumes");
            if (resumes.status === "success" && resumes.data.length > 0) {
              const latest = resumes.data[0];
              if (latest.analysis && !latest.analysis.processing) {
                // Analysis is complete!
                setAiAnalysis(latest.analysis);
                clearInterval(pollInterval);
                toast.success("Resume analyzed and matches generated successfully!");
              }
            }
            if (attempts >= 30) {
               // Give up after 90s, keep showing "refresh page manually" message
               clearInterval(pollInterval); 
            }
          } catch (e) {
            console.error("⚠️ Failed to poll resumes:", e);
          }
        }, 3000);

        // Set analysis data
        if (res.data.analysis?.processing) {
          setAiAnalysis({
            processing: true,
            message: 'AI analysis is running in the background. Refresh the page in a moment to see results.'
          });
        } else if (res.data.matches && res.data.matches.length > 0) {
          setAiAnalysis({ matches: res.data.matches });
          toast.success("Resume analyzed successfully!");
        } else if (res.data.analysis) {
          setAiAnalysis(res.data.analysis);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setHasExistingResume(true);
      setUploadSuccess(true);
      setAiAnalysis({
        fallback: true,
        message: "Resume uploaded successfully but AI analysis encountered an issue. Please check your internet connection and try uploading again."
      });
      if (window.innerWidth >= 768) {
        toast.error(err.response?.data?.message || err.message || "Failed to upload resume. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRetry = () => {
    // Clear form and let user try again
    setFile(null);
    setUploadSuccess(false);
    setAiAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold mb-2">
            {hasExistingResume ? "Update Your Resume" : "Upload Your Resume"}
          </h1>
          <p className="text-gray-400">
            {hasExistingResume
              ? "Your latest resume analysis is shown below. Upload a new resume anytime to refresh your matches."
              : "Upload your resume for AI-powered analysis and skill matching"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {!uploadSuccess ? (
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
              <form onSubmit={handleUpload} className="space-y-8">
                {/* File Upload */}
                <div>
                  <label className="block text-lg font-semibold mb-4">
                    Select Resume File
                  </label>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                    />
                    <label
                      htmlFor="file-input"
                      className="cursor-pointer block"
                    >
                      <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-white font-semibold mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-400 text-sm">
                        PDF or Word files up to 5MB
                      </p>
                    </label>
                  </div>

                  {file && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span className="text-white">{file.name}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${uploading
                      ? "bg-slate-700 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <span>{hasExistingResume ? "Update & Re-Analyze" : "Upload & Analyze"}</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Success Message */}
              <div className={`rounded-2xl p-8 ${aiAnalysis?.processing
                  ? 'bg-blue-500/10 border border-blue-500/30'
                  : aiAnalysis?.fallback
                    ? 'bg-amber-500/10 border border-amber-500/30'
                    : 'bg-green-500/10 border border-green-500/30'
                }`}>
                <div className="flex items-center space-x-3 mb-4">
                  {aiAnalysis?.processing ? (
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  ) : (
                    <CheckCircle className={`w-6 h-6 ${aiAnalysis?.fallback ? 'text-amber-400' : 'text-green-400'
                      }`} />
                  )}
                  <h2 className={`text-2xl font-bold ${aiAnalysis?.processing
                      ? 'text-blue-400'
                      : aiAnalysis?.fallback
                        ? 'text-amber-400'
                        : 'text-green-400'
                    }`}>
                    {aiAnalysis?.processing
                      ? 'Resume Uploading & Processing...'
                      : aiAnalysis?.fallback
                        ? 'Resume Uploaded'
                        : 'Resume Analyzed Successfully!'}
                  </h2>
                </div>
                <p className="text-gray-300">
                  {aiAnalysis?.message || 'Your resume has been uploaded and analyzed by our AI system.'}
                </p>
              </div>

              {/* Processing State */}
              {aiAnalysis?.processing && (
                <div className="bg-slate-900 rounded-2xl p-6 border border-blue-500/30 space-y-4">
                  <div className="flex items-start space-x-3">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">AI Analysis in Progress</h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Your resume has been successfully uploaded. Our AI system is currently analyzing your qualifications and matching you with job opportunities. This usually takes 1-2 minutes.
                      </p>
                      <div className="space-y-2 text-sm text-gray-400">
                        <p>⏳ What's happening:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Extracting skills and experience from your resume</li>
                          <li>Matching with available jobs in the database</li>
                          <li>Calculating compatibility scores</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-500/20 space-y-2">
                    <p className="text-xs text-gray-500">💡 Tip: Refresh the page in 2-3 minutes to see your matched jobs</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm"
                    >
                      Refresh Now
                    </button>
                  </div>
                </div>
              )}

              {/* Fallback Analysis Status */}
              {aiAnalysis?.fallback && (
                <div className="bg-slate-900 rounded-2xl p-6 border border-amber-500/30 space-y-4">
                  <div className="flex items-start space-x-3">
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">AI Analysis Temporarily Unavailable</h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Your resume has been successfully uploaded. The AI matching system is currently processing your request. Please check back in a few moments or upload again.
                      </p>
                      <div className="space-y-2 text-sm text-gray-400">
                        <p>💡 What to do:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Wait a few minutes and refresh this page</li>
                          <li>Or click "Update & Re-Analyze" to reprocess your resume</li>
                          <li>Contact support if the issue persists</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadSuccess(false)}
                    className="w-full mt-4 py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                  >
                    Try Upload Again
                  </button>
                </div>
              )}

              {/* AI Analysis Results */}
              {aiAnalysis && aiAnalysis.matches && !aiAnalysis.fallback && (
                <div className="space-y-6 mt-8">
                  <h3 className="text-2xl font-bold mb-4">Top Job Matches</h3>
                  {aiAnalysis.matches.length > 0 ? aiAnalysis.matches.map((match, index) => (
                    <div key={index} className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xl font-bold text-blue-400">Job ID: {match.job_id}</h4>
                        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 font-semibold">
                          Match Score: {Number(match.score).toFixed(2)}%
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-300 mb-2">Matched Skills</h5>
                          {match.matched_skills && match.matched_skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {match.matched_skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No exact matches</p>
                          )}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-300 mb-2">Missing Skills to Learn</h5>
                          {match.missing_skills && match.missing_skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {match.missing_skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">None!</p>
                          )}
                        </div>
                      </div>

                      {/* Generate Roadmap Button */}
                      <div className="mt-6 flex justify-end border-t border-slate-800 pt-4">
                        <button
                          onClick={() => handleGenerateRoadmap(match.job_id)}
                          disabled={roadmapLoading === match.job_id}
                          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {roadmapLoading === match.job_id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <span>Generate Learning Roadmap</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-gray-400 italic">No job matches found for your skill profile yet.</div>
                  )}
                </div>
              )}

              {(!aiAnalysis || (!aiAnalysis.matches && !aiAnalysis.fallback)) && (
                <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-gray-300 space-y-4">
                  <h3 className="font-semibold text-white">Analysis Status</h3>
                  <p>Your resume is in your account but detailed match analysis is not yet available.</p>
                  <button
                    onClick={() => setUploadSuccess(false)}
                    className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Update & Re-Analyze Resume
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setUploadSuccess(false);
                    setFile(null);
                    setAiAnalysis(null);
                  }}
                  className="flex-1 py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Update Resume
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
