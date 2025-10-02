// src/components/Tabs.jsx
import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center mt-6 space-x-4">
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
          activeTab === "transcript"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => setActiveTab("transcript")}
      >
        Transcript
      </button>
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
          activeTab === "audio"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => setActiveTab("audio")}
      >
        Audio
      </button>
    </div>
  );
};

export default Tabs;
