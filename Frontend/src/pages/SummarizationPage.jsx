import React, { useState } from "react";
import TranscriptSummarizer from "../components/summarizer/TranscriptSummarizer";
import AudioSummarizer from "../components/summarizer/AudioSummarizer";
import SummarizeFileUploader from "../components/summarizer/SummarizeFileUploader";
const SummarizationPage = () => {
  const [activeTab, setActiveTab] = useState("transcript");

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f0f4ff] to-[#e0e7ff] px-4 py-12">
      {/* Decorative Blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[250px] h-[250px] bg-indigo-300 opacity-30 rounded-full blur-2xl animate-pulse z-0" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] bg-purple-300 opacity-30 rounded-full blur-2xl animate-pulse z-0" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto backdrop-blur-md bg-white/30 rounded-2xl shadow-xl border border-white/20 p-8">
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
