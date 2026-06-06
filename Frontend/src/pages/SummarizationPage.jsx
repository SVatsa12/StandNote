import React, { useState } from "react";
import TranscriptSummarizer from "../components/summarizer/TranscriptSummarizer";
import AudioSummarizer from "../components/summarizer/AudioSummarizer";
import SummarizeFileUploader from "../components/summarizer/SummarizeFileUploader";
const SummarizationPage = () => {
  const [activeTab, setActiveTab] = useState("transcript");

  return (
    <div className="relative min-h-screen bg-[#f8faff] text-slate-800 overflow-hidden px-4 py-12">
      {/* Soft Pastel Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-300/40 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-blue-300/40 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-violet-200/50 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto backdrop-blur-2xl bg-white/60 rounded-2xl shadow-xl shadow-purple-900/5 border border-white/60 p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Smart Summarizer
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          <button
            onClick={() => setActiveTab("transcript")}
            className={`px-6 py-2 rounded-full font-medium border transition-all duration-300 ${
              activeTab === "transcript"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Transcript
          </button>

          <button
            onClick={() => setActiveTab("audio")}
            className={`px-6 py-2 rounded-full font-medium border transition-all duration-300 ${
              activeTab === "audio"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Audio
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`px-6 py-2 rounded-full font-medium border transition-all duration-300 ${
              activeTab === "file"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Upload File
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "transcript" && <TranscriptSummarizer />}
          {activeTab === "audio" && <AudioSummarizer />}
          {activeTab === "file" && <SummarizeFileUploader />}
        </div>
      </div>
    </div>
  );
};

export default SummarizationPage;
