import { ArrowRight, ChevronDown, Play, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { codeExamples, floatingCards } from "../data/CodeExamples.js";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("JobSeeker");

  useEffect(() => {
    function handleMouseMove(e) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const currentFloatingCard = floatingCards[activeTab];
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />

      <div className="absolute top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto text-center relative w-full">
        <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 text-center lg:text-left gap-6 sm:gap-8 lg:gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4 sm:mb-6 animate-in slide-in-from-bottom duration-700">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs sm:text-sm text-blue-300">
                Introducing SkillBridge AI
              </span>
            </div>

            <h1 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-4 sm:mb-6 animate-in slide-in-from-bottom duration-700 delay-100 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="bg-gradient-to-r from-white via-white to-orange-100 bg-clip-text text-transparent block mb-1 sm:mb-2">
                Grow Smarter
              </span>
              <span className="bg-gradient-to-b from-orange-400 via-orange-500 to-orange-400 bg-clip-text text-transparent block mb-1 sm:mb-2">
                Match Faster
              </span>
              <span className="bg-gradient-to-r from-white via-white to-orange-100 bg-clip-text text-transparent block mb-1 sm:mb-2">
                With SkillBridge
              </span>
            </h1>

            <p className="text-md sm:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-8 animate-in slide-in-from-bottom duration-700 delay-200 leading-relaxed">
              Bridge the gap between talent and opportunity with AI-powered
              skill matching. Find the perfect job or ideal candidate in
              minutes, not months.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-12 animate-in slide-in-from-bottom duration-700 delay-300">
              <button className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-b from-blue-600 to-blue-400 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-102 flex items-center justify-center space-x-2">
                <span>Find Your Next Job</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-white/10 flex items-center justify-center space-x-2">
                <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 duration-300 transition-colors">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                </div>
                <span>Post a Job</span>
              </button>
            </div>
          </div>
          <div className="relative order-2 w-full">
            <div className="relative bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/10">
              <div className="bg-gradient-to-br from-gray-900/20 to-gray-800/20 backdrop-blur-sm rounded-lg overflow-hidden h-[280px] sm:h-[350px] lg:h-[450px] border border-white/5 flex flex-col">
                {/* IDE HEADER */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-white/5 backdrop-blur-sm border-b border-white/10 shrink-0">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-300">
                      SkillBridge AI
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>

                <div className="p-3 sm:p-4 relative flex-1 flex flex-col min-h-0">
                  {/* file tabs */}
                  <div className="flex space-x-1 sm:space-x-2 mb-3 sm:mb-4 overflow-x-auto shrink-0">
                    <button
                      onClick={() => setActiveTab("JobSeeker")}
                      className={`px-3 py-2 backdrop-blur-sm tex-xs sm:text-sm rounded-t-lg border ${activeTab === "JobSeeker"
                        ? "bg-blue-500/30 text-white border-blue-400/20"
                        : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                        }  transition-all duration-200 whitespace-nowrap`}
                    >
                      Job Seeker
                    </button>
                    <button
                      onClick={() => setActiveTab("JobProvider")}
                      className={`px-3 py-2 backdrop-blur-sm tex-xs sm:text-sm rounded-t-lg border ${activeTab === "JobProvider"
                        ? "bg-blue-500/30 text-white border-blue-400/20"
                        : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                        }  transition-all duration-200 whitespace-nowrap`}
                    >
                      Job Provider
                    </button>
                  </div>

                  {/* Code Content */}
                  <div className="relative overflow-auto flex-1 rounded-lg bg-black/40 border border-white/5">
                    <SyntaxHighlighter
                      language="text"
                      style={nightOwl}
                      wrapLongLines={true}
                      customStyle={{
                        marginLeft: 12,
                        backgroundColor: "transparent",
                        borderRadius: "8px",
                        fontSize: "13px",
                        lineHeight: "1.5",
                        minHeight: "100%",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        textAlign: "left",
                        fontFamily: "'Outfit', sans-serif"
                      }}
                    >
                      {codeExamples[activeTab]}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div
                className={`hidden lg:block absolute bottom-4 right-4 transform translate-x-8 translate-y-8 w-72 ${currentFloatingCard.bgColor} backdrop-blur-xl rounded-lg p-4 border border-white/20 shadow-2xl`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className={`w-6 h-6 ${currentFloatingCard.iconColor} flex items-center justify-center text-sm font-bold`}
                  >
                    {currentFloatingCard.icon}
                  </div>
                  <span
                    className={`text-sm font-medium ${currentFloatingCard.textColor}`}
                  >
                    {currentFloatingCard.title}
                  </span>
                </div>

                <div
                  className={`text-sm text-left ${currentFloatingCard.contentColor}`}
                >
                  {currentFloatingCard.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
