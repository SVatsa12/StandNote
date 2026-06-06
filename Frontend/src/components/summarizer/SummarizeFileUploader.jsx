import React, { useState } from "react";

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

const SummarizeFileUploader = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a .txt or .pdf file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/v1/summarize/summarize-file", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Upload failed");

      setSummary(typeof data.summary === 'string' ? cleanSummary(data.summary) : JSON.stringify(data.summary));
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong");
      setSummary("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Upload File for Summarization</h2>

      <input
        type="file"
        accept=".txt,.pdf"
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded px-4 py-2"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Uploading..." : "Summarize File"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {summary && (
        <div className="mt-4 bg-gray-100 rounded p-4 max-h-96 overflow-y-auto space-y-2">
          <h3 className="font-semibold">Summary:</h3>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default SummarizeFileUploader;