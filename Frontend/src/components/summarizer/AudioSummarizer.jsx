import React, { useState } from "react";
import { UploadCloud, PlayCircle } from "lucide-react";
import axios from "axios";
import MessageBubble from "./MessageBubble"; // ✅ Update path if needed

const AudioSummarizer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setSummary("");
    } else {
      alert("Please upload a valid audio file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setSummary("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSummarize = async () => {
    if (!audioFile) return;

    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/v1/summarize/summarize-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const rawSummary = res.data?.meeting?.summary || "";
      setSummary(rawSummary.trim());
    } catch (error) {
      console.error("Error summarizing audio:", error);
      alert("Something went wrong while summarizing the audio.");
    } finally {
      setLoading(false);
    }
  };

  // Safely convert summary string to bullet points
const bulletSummary = Array.isArray(summary)
  ? summary
  : typeof summary === "string"
  ? summary
      .split(/[.?!:]\s+/) // split by sentence
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  : [];

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 transition-all">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Summarize from Audio
        </h2>
        <p className="text-sm text-gray-500">
          Upload an audio file to generate a smart summary
        </p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100 transition cursor-pointer rounded-lg p-8 text-center"
      >
        <label
          htmlFor="audio-upload"
          className="flex flex-col items-center justify-center gap-2"
        >
          <UploadCloud className="w-10 h-10 text-blue-500" />
          <span className="text-blue-600 font-medium">
            Click or drag & drop audio file
          </span>
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {audioFile && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-md">
            <div className="flex items-center gap-3">
              <PlayCircle className="text-green-500" />
              <span className="text-gray-800 font-medium">
                {audioFile.name}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {(audioFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>

          <button
            onClick={handleSummarize}
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Summarizing..." : "Generate Summary"}
          </button>
        </div>
      )}

      {bulletSummary.length > 0 && (
        <div className="flex flex-col gap-2 mt-4">
          <MessageBubble
            sender="ai"
            message={
              <div>
                <div className="font-semibold mb-2 text-blue-800">
                  🧠 Smart Summary:
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
                  {bulletSummary.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default AudioSummarizer;
