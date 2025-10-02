import React from "react";

// Utility to convert seconds → mm:ss
const formatTime = (seconds) => {
  if (typeof seconds !== "number" || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const TranscriptViewer = ({ transcript, audioRef }) => {
  const handleSeek = (timeInSeconds) => {
    if (audioRef?.current && typeof timeInSeconds === "number") {
      audioRef.current.currentTime = timeInSeconds;
      audioRef.current.play();
    }
  };

  return (
    <div className="mt-6 max-h-72 overflow-y-auto border rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
      {transcript.map((line, index) => (
        <div
          key={index}
          className="mb-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-2 py-1 transition"
         onClick={() => handleSeek(line.start)}// Use line.start as timestamp
        >
          <p className="text-sm text-gray-700 dark:text-gray-200">
            <span className="text-blue-600 font-medium">
              [{formatTime(parseFloat(line.start))}]
            </span>{" "}
            <strong>{line.speaker}:</strong> {line.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TranscriptViewer;
