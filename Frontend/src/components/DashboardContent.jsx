import React, { useState, useEffect, useCallback } from 'react';
import TimelineView from './dashboard/TimelineView';
import { X, Trash2 } from 'lucide-react';

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

const DashboardContent = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const fetchMeetings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/live-meeting/all');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      const formattedData = data.map(meeting => ({
        ...meeting,
        startTime: new Date(meeting.created_at)
      }));

      setMeetings(formattedData);
    } catch (e) {
      console.error("Failed to fetch meetings:", e);
      setError("Could not load your meetings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleDeleteMeeting = useCallback(async (meetingId) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/live-meeting/${meetingId}`, {
        method: 'DELETE',
      });
      setSelectedMeeting(null);
      await fetchMeetings();
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  }, [fetchMeetings]);

  if (isLoading) return <div className="text-slate-500 font-semibold p-8 animate-pulse">Loading...</div>;
  if (error) return <div className="text-red-500 font-semibold p-8">{error}</div>;

  const glassCardClasses = "bg-white/60 backdrop-blur-2xl border border-white/60 shadow-xl shadow-purple-900/5 rounded-xl";

  return (
    <div className="flex flex-col gap-8 text-slate-800 pb-10">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Meeting History</h1>
        <p className="text-slate-500 text-sm">A visual history of your transcribed meetings. Click a dot on the timeline to scroll to its card.</p>
      </header>

      {meetings.length > 0 && (
        <section className="mb-6">
          <TimelineView
            meetings={meetings}
            onMeetingClick={(meeting) => {
              const cardElement = document.getElementById(`meeting-card-${meeting.id}`);
              if (cardElement) {
                cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            onMeetingHover={() => { }}
            onMouseOut={() => { }}
          />
        </section>
      )}

      <main className="grid grid-cols-1 gap-4">
        {meetings.length === 0 ? (
          <div className="text-slate-500 text-sm">You have no saved meetings yet.</div>
        ) : (
          [...meetings].sort((a, b) => b.startTime - a.startTime).map((meeting) => (
            <div key={meeting.id} id={`meeting-card-${meeting.id}`} className={`${glassCardClasses} p-6 flex flex-col gap-4`}>
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-lg font-semibold text-slate-900">{meeting.title || "Untitled Meeting"}</h3>
                <span className="text-sm text-slate-400 whitespace-nowrap">
                  {meeting.startTime && meeting.startTime instanceof Date
                    ? meeting.startTime.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                    : 'No date available'}
                </span>
              </div>
              
              <div className="text-slate-600 text-sm line-clamp-3">
                {cleanSummary(meeting.summary) || 'No summary available.'}
              </div>

              <div className="mt-2 flex justify-between items-center">
                <button 
                  onClick={() => setSelectedMeeting(meeting)}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                >
                  View Full Transcript &rarr;
                </button>
                <button 
                  onClick={() => handleDeleteMeeting(meeting.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/50"
                  title="Delete meeting"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Modal */}
      {selectedMeeting && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          onClick={() => setSelectedMeeting(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedMeeting(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-slate-900 mb-1 pr-8">{selectedMeeting.title}</h2>
            <p className="text-sm text-slate-500 mb-6">
              {selectedMeeting.startTime && selectedMeeting.startTime instanceof Date
                ? selectedMeeting.startTime.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                : ''}
            </p>

            <div className="overflow-y-auto pr-2 flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Summary</h3>
                <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {cleanSummary(selectedMeeting.summary) || 'No summary available.'}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Transcript</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-slate-600 font-mono whitespace-pre-wrap leading-relaxed">
                    {selectedMeeting.transcript || 'No transcript available.'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;