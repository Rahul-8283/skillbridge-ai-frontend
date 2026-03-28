import { useState } from "react";
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

  const { generateLearningPlan } = useLearning();
  const [roadmapLoading, setRoadmapLoading] = useState(null);

  const handleGenerateRoadmap = async (jobId) => {
    setRoadmapLoading(jobId);
    try {
      await generateLearningPlan(jobId, 2);
      toast.success("Learning roadmap generated successfully!");
      navigate("/learning-plan");
    } catch(err) {
      console.error(err);
      toast.error("Failed to generate learning roadmap.");
    } finally {
      setRoadmapLoading(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Only allow PDF and text files
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type === "text/plain"
      ) {
        setFile(selectedFile);
        setUploadSuccess(false);
      } else {
        alert("Please upload a PDF or text file");
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
        timeout: 120000, // 2 minutes for AI analysis
      });

      if (res.status === "success") {
        if (res.data.analysis) {
          setAiAnalysis(res.data.analysis);
          setUploadSuccess(true);
          if (window.innerWidth >= 768) {
            toast.success("Resume uploaded and analyzed successfully!");
          }
        } else {
          throw new Error("AI analysis failed in the backend. Please try a different resume.");
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      if (window.innerWidth >= 768) {
        toast.error(err.message || "Failed to upload resume. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/seeker-dashboard")}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold mb-2">Upload Your Resume</h1>
          <p className="text-gray-400">
            Upload your resume for AI-powered analysis and skill matching
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
                      accept=".pdf,.txt"
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
                        PDF or TXT files up to 10MB
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
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    uploading
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
                    <span>Upload & Analyze</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Success Message */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h2 className="text-2xl font-bold text-green-400">
                    Resume Analyzed Successfully!
                  </h2>
                </div>
                <p className="text-gray-300">
                  Your resume has been uploaded and analyzed by our AI system.
                </p>
              </div>

              {/* AI Analysis Results */}
              {aiAnalysis && aiAnalysis.matches && (
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
                  Upload Another Resume
                </button>
                <button
                  onClick={() => navigate("/seeker-dashboard")}
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
