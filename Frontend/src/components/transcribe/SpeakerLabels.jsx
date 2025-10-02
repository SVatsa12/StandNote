import React from "react";

const SpeakerLabels = ({ speakers }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {speakers.map((speaker, i) => (
        <span
          key={i}
          className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
        >
          🎤 {speaker}
        </span>
      ))}
    </div>
  );
};

export default SpeakerLabels;
