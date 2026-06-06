import React, { useState, useRef } from "react";
import axios from "axios";
import AudioPlayer from "./AudioPlayer";
import TranscriptViewer from "./TranscriptViewer";
import SpeakerLabels from "./SpeakerLabels";

const AudioTranscriber = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type.startsWith("audio/")) {
      setFile(uploaded);
      setResult(null);
    } else {
      alert("Invalid audio file.");
    }
  };

  const handleTranscribe = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://standnote.onrender.com/api/v1/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error("Transcription error:", err);
      alert("Failed to transcribe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        Transcribe Audio
      </h2>

      <input type="file" accept="audio/*" onChange={handleFileChange} />

      <button
        onClick={handleTranscribe}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Transcribing..." : "Transcribe"}
      </button>

      {result?.audio_url && (
        <AudioPlayer audioSrc={result.audio_url} audioRef={audioRef} />
      )}

      {result?.transcript?.length > 0 && (
        <>
          {result?.speakers?.length > 0 && (
            <SpeakerLabels speakers={result.speakers} />
          )}
          <TranscriptViewer
            transcript={result.transcript}
            audioRef={audioRef}
          />
        </>
      )}
    </div>
  );
};

export default AudioTranscriber;
