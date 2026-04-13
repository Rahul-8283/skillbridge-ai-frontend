export const codeExamples = {
  "JobSeeker": `import { useState } from "react";
import { SkillBridgeAI } from "@skillbridge/sdk";

export default function JobSeekerDashboard() {
  const [profileMatch, setProfileMatch] = useState(null);

  const analyzeAndMatch = async (resumeFile) => {
    // 1. Extract skills via advanced AI syntax parser
    const skills = await SkillBridgeAI.parseResume(resumeFile);
    
    // 2. Query Vector DB for high-compatibility roles
    const matches = await SkillBridgeAI.findRoles(skills);
    
    // 3. Generate missing-skill learning roadmaps
    const roadmap = await SkillBridgeAI.buildRoadmap(skills);
    
    setProfileMatch({ matches, roadmap });
  };

  return (
    <div className="seeker-dashboard p-6">
      <h1>Your Skill Match: {profileMatch?.matches[0].score || '0'}%</h1>
      <button onClick={() => analyzeAndMatch(myResume)}>
        Analyze My Profile
      </button>
      {profileMatch?.roadmap && <LearningPath data={profileMatch.roadmap} />}
    </div>
  );
}`,
  "JobProvider": `import { useState, useCallback } from "react";
import { SkillBridgeAI } from "@skillbridge/sdk";

export default function JobProviderDashboard() {
  const [candidates, setCandidates] = useState([]);

  const scanTalentPool = useCallback(async (jobRequirement) => {
    // 1. Convert requirements into semantic embeddings
    const reqVector = await SkillBridgeAI.embed(jobRequirement);
    
    // 2. Scan millions of profiles instantly
    const results = await SkillBridgeAI.vectorSearch(reqVector, { minScore: 0.90 });
    
    // 3. Auto-schedule initial AI interviews
    await SkillBridgeAI.scheduleInterviews(results.slice(0, 5));
    
    setCandidates(results);
  }, []);

  return (
    <section className="provider-dashboard p-6">
      <h2>Top Candidate Matches: {candidates.length}</h2>
      <button onClick={() => scanTalentPool(openReq)}>
        Find Perfect Candidates
      </button>
      <CandidateGrid candidates={candidates} />
    </section>
  );
}`,
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
