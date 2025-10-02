import React, { useState, useEffect, useCallback } from 'react';
import TimelineView from './dashboard/TimelineView';
import FoldableMeetingCard from './dashboard/FoldableMeetingCard';
import MeetingDetailsModal from './dashboard/MeetingDetailsModal';
import './dashboard/Dashboard.css';

const DashboardContent = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

  // DashboardContent.js (Replace only this function)

  const fetchMeetings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/live-meeting/all');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      // --- THIS IS THE CORRECTED LOGIC ---
      // 1. Convert the `created_at` string into a real JavaScript Date object for every meeting.
      // 2. We will call this property `startTime` for clarity and use it everywhere.
      const formattedData = data.map(meeting => ({
        ...meeting,
        startTime: new Date(meeting.created_at) // Convert string to Date object
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

  const handleCardToggle = (meetingId) => {
    setExpandedCardId(prevId => (prevId === meetingId ? null : meetingId));
  };

  if (isLoading) return <div className="dashboard-status">Loading...</div>;
  if (error) return <div className="dashboard-status error">{error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Meeting Dashboard</h1>
        <p>A visual history of your transcribed meetings. Click a dot on the timeline to scroll to its card.</p>
      </header>

      {meetings.length > 0 && (
        <section className="timeline-section">
          <TimelineView
            meetings={meetings}
            onMeetingClick={(meeting) => {
              const cardElement = document.getElementById(`meeting-card-${meeting.id}`);
              if (cardElement) {
                setExpandedCardId(meeting.id);
                cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            onMeetingHover={() => { }}
            onMouseOut={() => { }}
          />
        </section>
      )}

      <main className="meeting-list">
        {meetings.length === 0 ? (
          <div className="dashboard-status">You have no saved meetings yet.</div>
        ) : (
          [...meetings].sort((a, b) => b.startTime - a.startTime).map((meeting) => (
            <FoldableMeetingCard
              key={meeting.id}
              meeting={meeting}
              isOpen={expandedCardId === meeting.id}
              onToggle={() => handleCardToggle(meeting.id)}
              onViewDetails={setSelectedMeeting}
            />
          ))
        )}
      </main>

      <MeetingDetailsModal
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
        onDelete={handleDeleteMeeting}
      />
    </div>
  );
};

export default DashboardContent;