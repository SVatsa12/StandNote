import React, { useState } from "react";
import { ScrollText, Sparkles } from "lucide-react";

function cleanSummary(text) {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\s*[-•]\s+/gm, '')
    .replace(/[━─\|]+/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

const TranscriptSummarizer = () => {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      alert("Please paste a transcript to summarize.");
      return;
    }

    setLoading(true);
    setSummary(""); // clear previous summary

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/v1/summarize/transcript",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        const cleaned = Array.isArray(data.summary)
          ? data.summary.map(s => cleanSummary(s)).filter(Boolean)
          : cleanSummary(data.summary);
        setSummary(cleaned);
        console.log("Summary result:", cleaned);
      } else {
        console.error("Summarization failed:", data.detail || data);
        alert("Failed to summarize. Please try again.");
      }
    } catch (error) {
      console.error("Error summarizing:", error);
      alert("Something went wrong while summarizing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 transition-all">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Summarize from Transcript
        </h2>
        <p className="text-sm text-gray-500">
          Paste or edit your transcript text to generate a summary
        </p>
      </div>

      {/* Transcript Textarea */}
      <div className="relative">
        <textarea
          className="w-full min-h-[200px] resize-y border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder:text-gray-400"
          placeholder="Paste your transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
        <ScrollText className="absolute top-3 right-3 text-gray-400" />
      </div>

      {/* Summarize Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition disabled:opacity-60"
        >
          <Sparkles size={18} />
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </div>

      {/* Summary Output */}
      {summary && typeof summary === 'string' && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300 text-gray-800">
          <h3 className="text-lg font-medium mb-2">Summary:</h3>
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptSummarizer;
