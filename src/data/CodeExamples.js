export const codeExamples = {
  "JobSeeker": `import { useState } from "react";
import { analyzeResume } from "@skillbridge/ai";

function JobSeeker() {
  const [matchScore, setMatchScore] = useState(0);

  const calculateSkillMatch = async (resume) => {
    const score = await analyzeResume(resume);
    setMatchScore(score);
  };

  return (
    <div className="seeker-dashboard">
      <h2>Your Skill Match: {matchScore}%</h2>
      <button onClick={() => calculateSkillMatch()}>
        Analyze My Resume
      </button>
    </div>
  );
}`,
  "JobProvider": `import { useState } from "react";
import { findCandidates } from "@skillbridge/ai";

export default function JobProvider() {
  const [candidates, setCandidates] = useState([]);

  const searchCandidates = async (jobDesc) => {
    const results = await findCandidates(jobDesc);
    setCandidates(results);
  };

  return (
    <section className="provider-dashboard">
      <h2>Top Matches: {candidates.length}</h2>
      <button onClick={() => searchCandidates()}>
        Find Perfect Candidates
      </button>
    </section>
  );
}`,
};

export const floatingCards = {
  "JobSeeker": {
    bgColor: "bg-blue-500/20",
    iconColor: "text-blue-400",
    textColor: "text-blue-200",
    contentColor: "text-blue-300",
    icon: "📊",
    title: "Resume Analysis",
    content: "AI analyzes your skills and matches with perfect jobs",
  },
  "JobProvider": {
    bgColor: "bg-purple-500/20",
    iconColor: "text-purple-400",
    textColor: "text-purple-200",
    contentColor: "text-purple-300",
    icon: "🎯",
    title: "Smart Matching",
    content: "Find candidates perfectly matched to your job description",
  },
};
