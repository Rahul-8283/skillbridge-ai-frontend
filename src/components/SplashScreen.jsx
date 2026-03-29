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
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
          >
            {/* Futuristic Background Ambient Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[15%] left-[20%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen blur-[120px] opacity-10 animate-pulse"></div>
              <div className="absolute bottom-[15%] right-[20%] w-96 h-96 bg-blue-400 rounded-full mix-blend-screen blur-[120px] opacity-10 delay-700 animate-pulse"></div>
              {/* Scanline overlay for that enterprise AI engine look */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-6">
              {/* Central Logo Area with Spinning Pulse Rings */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative mb-14 flex flex-col items-center"
              >
                {/* Outer spinning ring */}
                <motion.div 
                  className="absolute -inset-10 rounded-full border-[1.5px] border-blue-600 border-t-transparent border-l-transparent opacity-40"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                {/* Inner spinning ring */}
                <motion.div 
                  className="absolute -inset-6 rounded-full border-[1.5px] border-blue-400 border-b-transparent border-r-transparent opacity-60"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-[0_0_25px_rgba(96,165,250,0.4)] flex items-center">
                  <span className="text-white">Skill</span>
                  <span className="text-blue-400">Bridge </span>
                  <span className="text-blue-200 ml-2 md:ml-3">AI</span>
                </h1>
                
                {/* Core glow behind text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500 blur-[70px] opacity-15 rounded-full -z-10 pointer-events-none"></div>
              </motion.div>

              {/* Futuristic Loading Bar */}
              <div className="w-full md:w-96 h-[3px] bg-slate-800 rounded-full overflow-hidden shadow-[0_0_10px_rgba(59,130,246,0.1)] mb-8 relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  // Duration exactly matches wait time before fade begins
                  transition={{ duration: 3.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-blue-700 via-blue-400 to-[#ffffff] rounded-full shadow-[0_0_20px_rgba(96,165,250,0.7)] relative"
                >
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-white opacity-60 blur-[3px]"></div>
                </motion.div>
              </div>

              {/* Dynamic Cycling Loading Text */}
              <div className="h-8 flex items-center justify-center overflow-hidden w-full">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={textIndex}
                    initial={{ y: 15, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -15, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="text-blue-400 text-xs md:text-sm font-mono tracking-[0.2em] text-center uppercase"
                  >
                    {loadingTexts[textIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
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
