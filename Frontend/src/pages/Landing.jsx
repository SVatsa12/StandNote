// src/pages/Landing.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            StandNote.AI
          </h1>
          <p className="text-lg text-gray-700">
            Your Smart Meeting Assistant — Transcribe, Summarize, and Extract
            Action Items effortlessly using AI.
          </p>
          <div className="flex gap-4">
            <Link
              to="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow-md transition"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-xl shadow-md transition"
            >
              Log In
            </Link>
          </div>
        </motion.div>

        {/* Right Side: Placeholder or empty for now */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          {/* Placeholder image or leave empty */}
        </motion.div>
      </div>
    </div>
  );
}
