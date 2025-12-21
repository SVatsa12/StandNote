// src/pages/Landing.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Scene3D from "../components/landing/Scene3D";
import { Mic, FileText, Sparkles, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Animated background with glossy effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-blue-500/[0.03] bg-[size:60px_60px]"></div>
      
      {/* Large glossy gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/40 via-indigo-400/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-tl from-indigo-400/40 via-blue-400/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Additional glossy layers */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-300/20 to-transparent rounded-full blur-2xl"></div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">AI-Powered Meeting Intelligence</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
              >
                StandNote.AI
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-700 leading-relaxed"
              >
                Your Smart Meeting Assistant — Transcribe, Summarize, and Extract
                Action Items effortlessly using AI.
              </motion.p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Mic, text: "Real-time Transcription" },
                { icon: FileText, text: "Smart Summarization" },
                { icon: Zap, text: "Action Items" },
                { icon: Sparkles, text: "AI-Powered Insights" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-blue-200"
                >
                  <feature.icon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link
                to="/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
              >
                <span className="relative z-10">Get Started Free</span>
              </Link>
              
              <Link
                to="/login"
                className="px-8 py-4 bg-white/70 hover:bg-white backdrop-blur-sm border border-blue-200 text-blue-700 font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - 3D Scene */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-indigo-400/20 rounded-3xl blur-3xl"></div>
            <div className="relative h-full rounded-3xl overflow-hidden border border-blue-200 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm">
              <Scene3D />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
