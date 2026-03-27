import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./hooks/useAuth.js";

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

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
function ProtectedRoute({ element, requiredRole = null }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <div className="flex items-center justify-center h-screen">Access Denied</div>;
  }

  return element;
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  // Auth is initialized in useAuth hook automatically
  useAuth();

  // Clear localStorage on app load (removes stale mock data)
  // Backend will provide fresh tokens when implemented
  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }, []);

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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
        <Navbar scrolled={scrolled} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HeroPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes - All Users */}
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />

          {/* Protected Routes - Seeker Only */}
          <Route
            path="/seeker-dashboard"
            element={<ProtectedRoute element={<SeekerDashboard />} requiredRole="seeker" />}
          />
          <Route
            path="/seeker-dashboard/upload-resume"
            element={<ProtectedRoute element={<UploadResumePage />} requiredRole="seeker" />}
          />
          <Route
            path="/seeker-dashboard/browse-jobs"
            element={<ProtectedRoute element={<BrowseJobsPage />} requiredRole="seeker" />}
          />
          <Route
            path="/seeker-dashboard/learning-plan"
            element={<ProtectedRoute element={<LearningPlanPage />} requiredRole="seeker" />}
          />

          {/* Protected Routes - Provider Only */}
          <Route
            path="/provider-dashboard"
            element={<ProtectedRoute element={<ProviderDashboard />} requiredRole="provider" />}
          />
          <Route
            path="/provider-dashboard/post-job"
            element={<ProtectedRoute element={<PostJobPage />} requiredRole="provider" />}
          />
          <Route
            path="/provider-dashboard/find-candidates"
            element={<ProtectedRoute element={<FindCandidatesPage />} requiredRole="provider" />}
          />
          <Route
            path="/provider-dashboard/my-postings"
            element={<ProtectedRoute element={<MyPostingsPage />} requiredRole="provider" />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
