import React, { useEffect, useState, useRef } from "react";
import { Mic, FileText, Brain, Wifi, CheckCircle2, XCircle, RefreshCw, Download } from "lucide-react";
import "../components/livemeetingcomponents/LiveMeetingPage.css";

// --- Helper Component: Dynamic Status Indicator (No changes needed) ---
const StatusIndicator = ({ status }) => {
  // This component is correct and complete.
  let icon = <Wifi size={16} className="status-icon connecting" />;
  let text = "Connecting...";
  let statusClass = "Connecting"; 

  if (status.includes("Connected") || status.includes("Loading")) {
    icon = <CheckCircle2 size={16} className="status-icon connected" />;
    text = "Connected. Ready for live updates.";
    statusClass = "Connected";
  } else if (status.startsWith("Recording")) {
    icon = <div className="recording-dot" />;
    text = status;
    statusClass = "Recording";
  } else if (status === "Completed") {
    icon = <CheckCircle2 size={16} className="status-icon completed" />;
    text = "Completed. Final results received.";
    statusClass = "Completed";
  } else if (status.includes("Error") || status.includes("Disconnected")) {
    icon = <XCircle size={16} className="status-icon error" />;
    text = status;
    statusClass = "Error";
  } else if (status.includes("Waiting")) { 
    icon = <Wifi size={16} className="status-icon idle" />;
    text = status;
    statusClass = "Idle";
  } else if (status === "Processing final results...") {
    icon = <Brain size={16} className="status-icon processing" />;
    text = status;
    statusClass = "Processing";
  }
  if (status.includes("Loading last meeting...")) {
      text = "Loading last meeting...";
  }

  return (
    <div className={`status-indicator ${statusClass}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

// --- Helper Component: Shimmer Loading Skeleton (No changes needed)---
const ShimmerPlaceholder = () => (
  <div className="shimmer-wrapper">
    <div className="shimmer-line"></div>
    <div className="shimmer-line"></div>
    <div className="shimmer-line"></div>
  </div>
);


// --- Main LiveMeetingTranscription Component ---
const LiveMeetingTranscription = () => {
  const [status, setStatus] = useState("Initializing...");
  const [transcript, setTranscript] = useState(null); 
  const [summary, setSummary] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  
  const socketRef = useRef(null);
  const transcriptContainerRef = useRef(null);
  const summaryContainerRef = useRef(null);

  // --- Logic for clearing the screen ---
  const handleRefresh = () => {
    setTranscript("The transcript will appear here when a new meeting starts.");
    setSummary("The summary will appear here after a meeting is completed.");
    setMeetingTitle("");
    setStatus("Connected. Waiting for a meeting to start.");
  };

  // --- Logic for downloading the text file ---
  const handleDownload = () => {
    const fileContent = `Meeting Title: ${meetingTitle || "N/A"}\n\n` +
                        `-------------------- TRANSCRIPT --------------------\n\n${transcript || "No transcript available."}\n\n` +
                        `--------------------- SUMMARY ---------------------\n\n${summary || "No summary available."}`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = (meetingTitle || "meeting").replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `standnote_${safeTitle}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- useEffect for Initial Load, WebSocket, and Extension Listener ---
  useEffect(() => {
    // 1. Load the initial meeting from the database
    const loadInitialMeeting = async () => {
      try {
        setStatus("Loading last meeting...");
        const response = await fetch("http://localhost:8000/api/v1/meetings/latest");
        const data = await response.json();

        if (response.ok) {
          setTranscript(data.transcript);
          setSummary(data.summary);
          setMeetingTitle(data.title);
          setStatus("Connected. Waiting for a meeting to start.");
        } else {
          throw new Error(data.error || "Failed to fetch latest meeting.");
        }
      } catch (error) {
        console.error("Failed to fetch latest meeting:", error);
        setStatus(`Error: ${error.message}`);
        setTranscript("Could not load the last meeting. Please try refreshing.");
        setSummary("");
      }
    };
    loadInitialMeeting();

    // 2. Connect to the WebSocket
    const connectWebSocket = () => {
      socketRef.current = new WebSocket("ws://localhost:8000/api/v1/ws/live-meeting");
      socketRef.current.onopen = () => socketRef.current.send(JSON.stringify({ role: "listener" }));
      socketRef.current.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            setTranscript(data.full_transcript || "No speech was detected."); 
            setSummary(data.full_summary || "No summary could be generated.");
            setStatus("Completed");
        } catch (error) {
            console.error("Failed to parse message from server:", error);
        }
      };
      socketRef.current.onclose = () => setStatus("Disconnected. Please refresh the page to reconnect.");
      socketRef.current.onerror = () => setStatus("Connection Error.");
    };
    connectWebSocket();
    
    // 3. Listen for status changes from the Chrome Extension
    const handleExtensionStateChange = (event) => {
      const { isRecording, meetingTitle } = event.detail;
      if (isRecording) {
        setTranscript(null);
        setSummary(null);
        setMeetingTitle(meetingTitle);
        setStatus(`Recording: ${meetingTitle}`); 
      } else {
        setStatus("Processing final results...");
      }
    };
    window.addEventListener('standnoteStateChange', handleExtensionStateChange);

    // Cleanup function
    return () => {
      if (socketRef.current) socketRef.current.close();
      window.removeEventListener('standnoteStateChange', handleExtensionStateChange);
    };
  }, []); // Runs only once on component mount

  // --- THIS IS THE SCROLLING EFFECT LOGIC ---
  useEffect(() => {
    // This hook runs every time the transcript or summary changes
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
    if (summaryContainerRef.current) {
      summaryContainerRef.current.scrollTop = summaryContainerRef.current.scrollHeight;
    }
  }, [transcript, summary]); // Dependency array ensures it runs when content updates

  // Variable to determine if there is content to download
  const hasContent = transcript && !transcript.startsWith("The transcript will appear here");

  return (
    <div className="live-meeting-wrapper">
      <header className="live-meeting-header">
        <h2><Mic /> Live Meeting Monitor</h2>
        <div className="header-controls">
          <button onClick={handleRefresh} className="control-btn" title="Clear and prepare for next meeting">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={handleDownload} 
            className="control-btn" 
            title="Download Notes"
            disabled={!hasContent}
          >
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
      </header>
      
      <div className="control-panel">
        <StatusIndicator status={status} />
      </div>

      <main className="content-grid">
        <div className="styled-card">
          <h3><FileText size={20} /> Live Transcript</h3>
          <div ref={transcriptContainerRef} className="card-content">
            <div className="scrollable-inner">
            {transcript === null ? <ShimmerPlaceholder /> : transcript}
          </div>
          </div>
        </div>
        
        <div className="styled-card">
          <h3><Brain size={20} /> Live Summary</h3>
          <div ref={summaryContainerRef} className="card-content">
            <div className="scrollable-inner">
            {summary === null ? <ShimmerPlaceholder /> : summary}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveMeetingTranscription;