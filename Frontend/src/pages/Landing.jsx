// src/pages/Landing.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import SonicWaveform from "../components/landing/SonicWaveform";
import { Mic, FileText, Sparkles, Zap, Layers, Shield, CheckCircle2, ArrowRight } from "lucide-react";

export default function Landing() {
  const { scrollY } = useScroll();
  const blurValue = useTransform(scrollY, [0, 400], [0, 20]);
  const opacityValue = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#f8faff] text-slate-800">
      {/* Soft Pastel Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-300/40 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-blue-300/40 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed top-[20%] right-[-10%] w-[40%] h-[40%] bg-violet-200/50 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      {/* Optional grid overlay for texture */}
      <div className="fixed inset-0 bg-grid-black/[0.02] bg-[size:60px_60px] pointer-events-none -z-10"></div>
      
      {/* --- HERO SECTION --- */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 py-20 lg:py-12">
        {/* Background Waveform with Scroll Fading/Blur */}
        <motion.div
          style={{
            filter: useTransform(blurValue, (value) => `blur(${value}px)`),
            opacity: opacityValue,
          }}
          className="absolute inset-0 z-0 pointer-events-auto"
        >
          <SonicWaveform />
          {/* A gradient overlay so text remains readable and waveform fades out */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8faff] via-[#f8faff]/20 to-transparent pointer-events-none"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center text-center mt-12">
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 flex flex-col items-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/60 backdrop-blur-2xl shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">AI-Powered Meeting Intelligence</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 drop-shadow-sm"
              >
                StandNote.AI
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-800 font-medium leading-relaxed max-w-2xl mx-auto"
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
              className="flex flex-wrap justify-center gap-4 max-w-3xl"
            >
              {[
                { icon: Mic, text: "Real-time Transcription" },
                { icon: FileText, text: "Smart Summarization" },
                { icon: Zap, text: "Action Items" },
                { icon: Sparkles, text: "AI-Powered Insights" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/60 backdrop-blur-2xl border border-white/60 shadow-sm hover:shadow-md transition-all text-slate-700"
                >
                  <feature.icon className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <Link
                to="/signup"
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Get Started Free</span>
              </Link>
              
              <Link
                to="/login"
                className="px-6 py-3 bg-white/60 hover:bg-white/80 backdrop-blur-2xl border border-white/60 text-slate-700 font-semibold rounded-xl shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
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
            className="w-6 h-10 border-2 border-slate-400 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-purple-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <section className="relative z-10 py-24 px-6 bg-white/30 backdrop-blur-lg border-t border-white/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">Supercharge your productivity</h2>
            <p className="text-slate-600 text-lg">Focus on the conversation, not on taking notes. Our AI analyzes your meetings in real-time to extract exactly what you need.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Layers, title: "Contextual Summaries", desc: "Get high-level overviews or deep-dive details. StandNote understands the full context of your discussions." },
              { icon: Zap, title: "Instant Action Items", desc: "Never miss a follow-up. Action items are automatically detected, assigned, and formatted for you." },
              { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and secure. We respect your privacy and never train public models on your meetings." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/60 shadow-xl shadow-purple-900/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  <feature.icon className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900">How it works</h2>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Record or Upload", desc: "Use our Chrome extension to record live meetings or upload your existing audio files directly to the dashboard." },
                  { step: "02", title: "AI Processing", desc: "Our advanced intelligence engine transcribes the audio and structures the conversation data instantly." },
                  { step: "03", title: "Review & Share", desc: "Access perfectly formatted notes, summaries, and action items ready to be shared with your team." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg border border-purple-200">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-300/40 to-purple-300/40 blur-3xl rounded-full"></div>
              <div className="relative rounded-2xl border border-white/60 bg-white/60 p-8 shadow-2xl backdrop-blur-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                  <div className="mt-8 p-4 rounded-xl bg-purple-50 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-700">AI Summary</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-purple-200/50 rounded w-full"></div>
                      <div className="h-3 bg-purple-200/50 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative z-10 py-24 px-6 bg-white/40 backdrop-blur-xl border-t border-white/60">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900">Ready to transform your meetings?</h2>
          <p className="text-xl text-slate-600">Join thousands of professionals who save hours every week using StandNote.AI.</p>
          <div className="pt-4 flex justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/60 bg-white/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">StandNote.AI</span>
          </div>
          <div className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} StandNote.AI. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="#" className="hover:text-purple-600 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-purple-600 transition-colors">Terms</Link>
            <Link to="#" className="hover:text-purple-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
