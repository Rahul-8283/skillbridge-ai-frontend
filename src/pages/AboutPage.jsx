import { motion } from "framer-motion";
import { Target, Lightbulb, Users, Zap, Briefcase, TrendingUp, Brain, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">About </span>
              <span className="text-blue-400">SkillBridge</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Bridging the gap between talent and opportunity through AI-powered skill development and intelligent job matching
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div {...fadeInUp} className="p-8 rounded-2xl bg-slate-800 border border-slate-700">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To revolutionize the way people develop their careers by creating an intelligent platform that connects skill development with real job opportunities. We believe everyone deserves access to personalized learning paths and meaningful employment opportunities.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div {...fadeInUp} className="p-8 rounded-2xl bg-slate-800 border border-slate-700" transition={{ delay: 0.2 }}>
              <div className="flex items-center space-x-3 mb-6">
                <Lightbulb className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To build a world where skill gaps are eliminated, talent is matched with opportunity instantly, and career growth is accessible to everyone regardless of background. We envision a future powered by AI-driven education and employment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">The Problem We Solve</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              The job market today faces critical challenges that impact millions of people globally
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div {...fadeInUp} className="p-6 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-400/10 border border-blue-500/30">
              <h3 className="text-xl font-bold mb-3 text-blue-400">Skill Gap Crisis</h3>
              <p className="text-gray-300">
                Job seekers lack access to personalized learning paths, making it difficult to acquire relevant skills for modern job market demands.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="p-6 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-400/10 border border-blue-500/30" transition={{ delay: 0.1 }}>
              <h3 className="text-xl font-bold mb-3 text-blue-400">Poor Job Matching</h3>
              <p className="text-gray-300">
                Traditional job platforms fail to match candidates with roles aligned to their skills and career aspirations effectively.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="p-6 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-400/10 border border-blue-500/30" transition={{ delay: 0.2 }}>
              <h3 className="text-xl font-bold mb-3 text-blue-400">Inefficient Hiring</h3>
              <p className="text-gray-300">
                Employers struggle to find qualified candidates and lack visibility into candidate skill development trajectories and potential.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How SkillBridge Works</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Our AI-powered platform connects talent development with employment opportunities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <motion.div {...fadeInUp} className="p-8 rounded-2xl bg-slate-800 border border-blue-500/30">
              <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-slate-700">
                <Users className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold">For Job Seekers</h3>
              </div>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Resume Analysis</h4>
                    <p className="text-gray-400">Upload your resume and our AI analyzes your current skillset and experience</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Personalized Learning Path</h4>
                    <p className="text-gray-400">Receive a customized learning plan based on your goals and skill gaps</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Intelligent Job Matching</h4>
                    <p className="text-gray-400">Get matched with jobs that align with your skills and career aspirations</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Progress Tracking</h4>
                    <p className="text-gray-400">Monitor your learning progress and skill development in real-time</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* For Job Providers */}
            <motion.div {...fadeInUp} className="p-8 rounded-2xl bg-slate-800 border border-blue-500/30" transition={{ delay: 0.2 }}>
              <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-slate-700">
                <Briefcase className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold">For Job Providers</h3>
              </div>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Post Intelligent Job Listings</h4>
                    <p className="text-gray-400">Create detailed job postings with required skills and qualifications</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Access Verified Talent Pool</h4>
                    <p className="text-gray-400">Browse candidates with verified skills and detailed assessment results</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Smart Candidate Matching</h4>
                    <p className="text-gray-400">Receive AI-recommended candidates that perfectly match your job requirements</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Track Candidate Growth</h4>
                    <p className="text-gray-400">Monitor candidate skill development and potential for future opportunities</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Powered by Advanced Technology</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Our platform leverages cutting-edge AI and machine learning to deliver superior results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div {...fadeInUp} className="p-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-400 transition-colors">
              <Brain className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-400">
                Advanced machine learning algorithms analyze resumes, job descriptions, and skill profiles to identify perfect matches
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="p-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-400 transition-colors" transition={{ delay: 0.1 }}>
              <Zap className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Real-Time Learning</h3>
              <p className="text-gray-400">
                Personalized learning recommendations updated instantly based on your progress and market demand
              </p>
            </motion.div>

            <motion.div {...fadeInUp} className="p-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-400 transition-colors" transition={{ delay: 0.2 }}>
              <TrendingUp className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">Skill Gap Insights</h3>
              <p className="text-gray-400">
                Detailed analytics showing skill gaps, market trends, and actionable recommendations for career growth
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose SkillBridge */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Choose SkillBridge?</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeInUp} className="flex space-x-4 p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">AI-Driven Accuracy</h3>
                <p className="text-gray-400">Our AI algorithms achieve 95%+ accuracy in skill-to-job matching</p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="flex space-x-4 p-6 rounded-lg bg-slate-800/50 border border-slate-700" transition={{ delay: 0.1 }}>
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Personalized Experience</h3>
                <p className="text-gray-400">Every learning path and job recommendation is uniquely tailored to you</p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="flex space-x-4 p-6 rounded-lg bg-slate-800/50 border border-slate-700" transition={{ delay: 0.2 }}>
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Comprehensive Skills Database</h3>
                <p className="text-gray-400">Access to 10,000+ skills and 100,000+ job roles with continuous updates</p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="flex space-x-4 p-6 rounded-lg bg-slate-800/50 border border-slate-700" transition={{ delay: 0.3 }}>
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Community Driven</h3>
                <p className="text-gray-400">Part of a global community of talents and employers committed to growth</p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="flex space-x-4 p-6 rounded-lg bg-slate-800/50 border border-slate-700" transition={{ delay: 0.4 }}>
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">24/7 Support</h3>
                <p className="text-gray-400">AI-powered assistance available round the clock to help your career journey</p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="flex space-x-4 p-6 rounded-lg bg-slate-800/50 border border-slate-700" transition={{ delay: 0.5 }}>
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Proven Results</h3>
                <p className="text-gray-400">Users land 3x faster into roles matched with their skills and aspirations</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Impact by Numbers</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            <motion.div {...fadeInUp} className="p-8 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-400/20 border border-blue-500/30 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <p className="text-gray-300">Active Users</p>
            </motion.div>

            <motion.div {...fadeInUp} className="p-8 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-400/20 border border-blue-500/30 text-center" transition={{ delay: 0.1 }}>
              <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <p className="text-gray-300">Job Placements</p>
            </motion.div>

            <motion.div {...fadeInUp} className="p-8 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-400/20 border border-blue-500/30 text-center" transition={{ delay: 0.2 }}>
              <div className="text-4xl font-bold text-blue-400 mb-2">1000+</div>
              <p className="text-gray-300">Partner Companies</p>
            </motion.div>

            <motion.div {...fadeInUp} className="p-8 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-400/20 border border-blue-500/30 text-center" transition={{ delay: 0.3 }}>
              <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
              <p className="text-gray-300">Satisfaction Rate</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already discovered their ideal career path with SkillBridge
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg flex items-center justify-center space-x-2 mx-auto hover:bg-blue-50 transition-all duration-300"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <h3 className="text-2xl font-bold mb-6">Questions? We're Here to Help</h3>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
              <a href="mailto:support@skillbridge.ai" className="text-blue-400 hover:text-blue-300 font-semibold">
                support@skillbridge.ai
              </a>
              <a href="tel:+1-800-SKILLBRIDGE" className="text-blue-400 hover:text-blue-300 font-semibold">
                +1-800-SKILLBRIDGE
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-300 font-semibold">
                Schedule a Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
