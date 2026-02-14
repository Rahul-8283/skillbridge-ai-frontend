import Navbar from "./components/Navbar.jsx";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroPage from "./pages/HeroPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import SeekerDashboard from "./pages/SeekerDashboard.jsx";
import ProviderDashboard from "./pages/ProviderDashboard.jsx";
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
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
        <Navbar scrolled={scrolled} />
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
