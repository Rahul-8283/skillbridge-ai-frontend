import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileText, CheckCircle } from "lucide-react";
import Footer from "../../components/Footer";

export default function UploadResumePage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

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

  const handleUpload = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    setUploading(true);

    // Simulate file upload and AI analysis
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("You must be logged in");
        navigate("/login");
        return;
      }

      // Store resume file info in localStorage
      const resumeData = {
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        userEmail: user.email,
        fileSize: file.size,
      };

      localStorage.setItem(`${user.email}_resume`, JSON.stringify(resumeData));

      // Simulate AI analysis
      const mockAnalysis = {
        skills: ["JavaScript", "React", "Node.js", "MongoDB", "REST APIs"],
        experience: "3-5 years",
        matchScore: 85,
        recommendations: [
          "Add more specific project examples",
          "Highlight AWS or cloud technologies",
          "Include metrics and achievements",
        ],
      };

      setAiAnalysis(mockAnalysis);
      setUploadSuccess(true);
      setUploading(false);
    }, 1500);
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
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    uploading
                      ? "bg-slate-700 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {uploading ? "Analyzing..." : "Upload & Analyze"}
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
              {aiAnalysis && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Skills Detected */}
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-xl font-bold mb-4">Skills Detected</h3>
                    <div className="space-y-2">
                      {aiAnalysis.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-slate-800 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-gray-300">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-xl font-bold mb-4">Job Match Score</h3>
                    <div className="text-5xl font-bold text-blue-400 mb-2">
                      {aiAnalysis.matchScore}%
                    </div>
                    <p className="text-gray-400">
                      Your profile matches available opportunities
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-xl font-bold mb-4">Experience Level</h3>
                    <p className="text-2xl font-semibold text-green-400">
                      {aiAnalysis.experience}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-xl font-bold mb-4">
                      Improvement Tips
                    </h3>
                    <ul className="space-y-2">
                      {aiAnalysis.recommendations.map((tip, index) => (
                        <li key={index} className="text-gray-300 text-sm">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
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
      <div className="h-20" />
    </div>
  );
}
