import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  const loadingTexts = [
    "Initializing Vector Embeddings...",
    "Loading Resume Parsing Engine...",
    "Warming up GenAI Roadmap Models...",
    "Calibrating Job Match Scoring..."
  ];

  useEffect(() => {
    // 3500ms total / 4 texts = 875ms per text cycle
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 850);

    // Completely unmount splash screen after exactly 3.5 seconds
    const hideTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 3500);

    return () => {
      clearInterval(textInterval);
      clearTimeout(hideTimeout);
    };
  }, [loadingTexts.length]);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
          >
            {/* Elegant, subtle background ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-orange-600 rounded-full mix-blend-screen blur-[150px] opacity-15"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative mb-8 flex flex-col items-center"
              >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-[0_0_15px_rgba(235,94,40,0.3)] flex items-center">
                  <span className="text-white">Skill</span>
                  <span className="text-orange-500">Bridge </span>
                  <span className="text-orange-300 ml-2 md:ml-3">AI</span>
                </h1>
              </motion.div>

              {/* Minimal Loading Bar */}
              <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden mb-6 relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-orange-600 via-orange-400 to-[#ffffff] rounded-full"
                ></motion.div>
              </div>

              {/* Rotating Loading Text */}
              <motion.div
                key={textIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="h-6 flex items-center justify-center w-full mb-6"
              >
                <p className="text-orange-400 text-sm font-medium tracking-wide text-center">
                  {loadingTexts[textIndex]}
                </p>
              </motion.div>

              {/* Static Explanatory Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex items-center justify-center w-full"
              >
                <p className="text-gray-300 text-base sm:text-lg font-medium tracking-wide text-center">
                  Where Talent Meets Opportunity Through Intelligence
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual app children mount immediately underneath and fetch data, but are visually covered by splash */}
      {children}
    </>
  );
};

export default SplashScreen;
