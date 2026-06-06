import React from 'react';
import { ChevronDown, FileText } from 'lucide-react';

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

function formatDate(dateObject) {
  if (!dateObject) return 'Date not available';
  if (!(dateObject instanceof Date) || isNaN(dateObject)) {
    return 'Invalid date';
  }
  return dateObject.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const FoldableMeetingCard = ({ meeting, isOpen, onToggle, onViewDetails }) => {
  return (
    <div 
      id={`meeting-card-${meeting.id}`}
      className={`meeting-card ${isOpen ? 'open' : ''}`}
    >
      <header className="meeting-card-header" onClick={onToggle}>
        <div>
          <h3 className="meeting-title">{meeting.title}</h3>
          
          {/* === THIS IS THE FIX === */}
          {/* We now use meeting.startTime, which is the Date object from the parent */}
          <p className="meeting-date">{formatDate(meeting.startTime)}</p>

        </div>
        <ChevronDown 
          className={`chevron-icon ${isOpen ? 'open' : ''}`}
        />
      </header>
      
      {/* 
        This is a note on the structure. The original code's animation relied on CSS 
        transitions. If the animation is not working as expected, the issue is 
        likely in the CSS, not this component's structure.
      */}
      <div className="meeting-card-body">
        <h4>Summary</h4>
        <p className="whitespace-pre-wrap">{cleanSummary(meeting.summary) || 'No summary was generated.'}</p>
        <button 
          className="view-details-btn" 
          onClick={() => onViewDetails(meeting)}
        >
          <FileText size={16} />
          <span>View Full Transcript & Details</span>
        </button>
      </div>
    </div>
  );
};

export default FoldableMeetingCard;