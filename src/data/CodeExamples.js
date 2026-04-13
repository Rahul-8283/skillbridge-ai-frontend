export const codeExamples = {
  "JobSeeker": `// 🟢 Generating tailored career path from uploaded resume

const profileAnalysis = {
  user: "Alex Chen",
  role_desired: "Frontend Developer",
  skill_match: "94%",
  top_matches: [
    { company: "TechVision Inc.", role: "Senior Explorer" },
    { company: "Global Systems", role: "UI/UX Developer" }
  ],
  missing_skills: ["GraphQL"],
  action: "Generating learning roadmap..."
};`,
  "JobProvider": `// 🟢 Scanning global talent pool for ideal matches

const candidateScan = {
  listing: "Lead Software Engineer",
  ideal_skills: ["React", "Node.js", "System Design"],
  top_candidates: [
    { name: "Sarah J.", score: "96%", highlight: "5 yrs Node" },
    { name: "Michael", score: "91%", highlight: "Strong React" }
  ],
  action: "Initiating automated brief interviews..."
};`,
};

export const floatingCards = {
  "JobSeeker": {
    bgColor: "bg-orange-500/20",
    iconColor: "text-orange-400",
    textColor: "text-white",
    contentColor: "text-orange-200",
    icon: "📊",
    title: "Resume Analysis",
    content: "AI analyzes your skills and matches with perfect jobs",
  },
  "JobProvider": {
    bgColor: "bg-orange-500/20",
    iconColor: "text-orange-400",
    textColor: "text-white",
    contentColor: "text-orange-200",
    icon: "🎯",
    title: "Smart Matching",
    content: "Find candidates perfectly matched to your job description",
  },
};
