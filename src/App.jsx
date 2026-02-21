import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import HeroPage from "./pages/HeroPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

import SeekerDashboard from "./pages/SeekerDashboard.jsx";
import ProviderDashboard from "./pages/ProviderDashboard.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import PostJobPage from "./pages/provider/PostJobPage.jsx";
import FindCandidatesPage from "./pages/provider/FindCandidatesPage.jsx";
import MyPostingsPage from "./pages/provider/MyPostingsPage.jsx";

import UploadResumePage from "./pages/seeker/UploadResumePage.jsx";
import BrowseJobsPage from "./pages/seeker/BrowseJobsPage.jsx";
import LearningPlanPage from "./pages/seeker/LearningPlanPage.jsx";

function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null;
}

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
        <Navbar scrolled={scrolled} />
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/provider-dashboard/post-job" element={<PostJobPage />} />
          <Route path="/provider-dashboard/find-candidates" element={<FindCandidatesPage />} />
          <Route path="/provider-dashboard/my-postings" element={<MyPostingsPage />} />

          <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
          <Route path="/seeker-dashboard/upload-resume" element={<UploadResumePage />} />
          <Route path="/seeker-dashboard/browse-jobs" element={<BrowseJobsPage />} />
          <Route path="/seeker-dashboard/learning-plan" element={<LearningPlanPage />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
