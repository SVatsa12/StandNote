import React from "react";

const AudioPlayer = ({ audioSrc, audioRef }) => {
  return (
    <div className="mt-4">
      <audio controls ref={audioRef} className="w-full rounded-lg">
        <source src={audioSrc} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
