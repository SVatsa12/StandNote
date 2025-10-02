import React, { useState, useEffect } from "react";
import { UploadCloud, Download } from "lucide-react";

const TranscribeAudio = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [transcriptText, setTranscriptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioURL, setAudioURL] = useState("");

  // Clean up audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("audio/")) {
      setFile(selectedFile);
      setTranscriptText("");
      setError("");
      setAudioURL(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setTranscriptText("");
      setAudioURL("");
      setError("Please upload a valid audio file.");
    }
  };

  const handleTranscribe = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      setTranscriptText("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/transcribe/transcribe",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to transcribe audio.");
      }

      const data = await response.json();
      console.log("[DEBUG] Response JSON:", data);

      const text = data.text || data.transcript || "";
      const segments = data.segments || [];

      setTranscriptText(text);

      onResult({
        text,
        segments,
        audioUrl: audioURL,
      });
    } catch (err) {
      console.error("[ERROR] Transcription failed:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([transcriptText], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = "transcript.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full h-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-teal-100 to-cyan-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-200 animate-fade-in">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2 text-indigo-600">
            <UploadCloud size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Audio Transcription
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Upload an audio file (.mp3, .wav) to generate transcript
          </p>
        </div>

        <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 hover:bg-indigo-50 transition-all duration-200 mb-4">
          <label className="block w-full text-center cursor-pointer">
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="text-indigo-600 font-medium">
              Click to upload or drag & drop audio here
            </span>
          </label>

          {file && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <span className="font-medium">Selected File:</span> {file.name}
            </div>
          )}
        </div>

        {audioURL && (
          <div className="mb-4">
            <audio controls className="w-full">
              <source src={audioURL} type={file?.type || "audio/mp3"} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <button
          onClick={handleTranscribe}
          disabled={!file || loading}
          className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-300 ${
            file && !loading
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading
            ? "Transcribing..."
            : file
            ? "Start Transcription"
            : "Upload an Audio File"}
        </button>

        {transcriptText && (
          <>
            <div className="mt-6 p-4 bg-gray-100 text-sm rounded-lg h-40 overflow-y-auto text-gray-700 whitespace-pre-wrap border">
              {transcriptText}
            </div>

            <button
              onClick={handleExport}
              className="mt-4 w-full py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
            >
              <Download size={18} /> Export Transcript
            </button>
          </>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-600 text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

export default TranscribeAudio;
