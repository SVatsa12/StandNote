import React, { useState, useEffect } from "react";
import TranscribeAudio from "../components/transcribe/TranscribeAudio";
import TranscriptViewer from "../components/transcribe/TranscriptViewer";
import AudioPlayer from "../components/transcribe/AudioPlayer";
import SpeakerLabels from "../components/transcribe/SpeakerLabels";

const TranscribePage = () => {
  const [transcriptText, setTranscriptText] = useState("");
  const [transcriptSegments, setTranscriptSegments] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleTranscriptionResult = ({ text, segments, audioUrl }) => {
    console.log("Received from backend:", { text, segments });
    setTranscriptText(text);
    setTranscriptSegments(segments || []);
    if (audioUrl) setAudioUrl(audioUrl);
  };

  const uniqueSpeakers = [
    ...new Set(transcriptSegments.map((seg) => seg.speaker).filter(Boolean)),
  ];

  useEffect(() => {
    console.log("[Updated Transcript Segments]:", transcriptSegments);
  }, [transcriptSegments]);

  return (
    <div className="relative min-h-screen bg-[#f8faff] text-slate-800 overflow-hidden">
      {/* Soft Pastel Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-300/40 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-blue-300/40 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-violet-200/50 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
      <div className="w-full text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
          Audio Transcription
        </h2>
      </div>

      <TranscribeAudio onResult={handleTranscriptionResult} />

      {audioUrl && <AudioPlayer audioSrc={audioUrl} />}
      {uniqueSpeakers.length > 0 && <SpeakerLabels speakers={uniqueSpeakers} />}
      {transcriptSegments.length > 0 && (
        <TranscriptViewer transcript={transcriptSegments} />
      )}

      {transcriptText && (
        <button
          onClick={() => downloadTranscript(transcriptText)}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Download Transcript
        </button>
      )}
      </div>
    </div>
  );
};

export default TranscribePage;

const downloadTranscript = (transcript) => {
  const text = transcript
    .map((t) => {
      const start = formatTimestamp(t.start);
      const end = formatTimestamp(t.end);
      const speaker = t.speaker || "Unknown";
      return `[${start} to ${end}] ${speaker}: ${t.text}`;
    })
    .join("\n\n");

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transcript.txt";
  link.click();
};

const formatTimestamp = (seconds) => {
  const secs = Number(seconds);
  if (isNaN(secs)) return "00:00:00"; // fallback for invalid timestamps

  const sec = Math.floor(secs % 60);
  const min = Math.floor((secs / 60) % 60);
  const hrs = Math.floor(secs / 3600);

  const padded = (n) => n.toString().padStart(2, "0");
  return `${padded(hrs)}:${padded(min)}:${padded(sec)}`;
};
