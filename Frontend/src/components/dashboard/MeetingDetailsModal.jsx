


import React, { useState } from 'react'; // <-- THIS LINE IS NOW CORRECT
import { Trash2, X } from 'lucide-react';

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

const MeetingDetailsModal = ({ meeting, onClose, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!meeting) return null;

  const handleDeleteClick = () => setShowConfirm(true);

  const handleConfirmDelete = () => {
    onDelete(meeting.id);
    setShowConfirm(false);
  };

  const handleCancelDelete = () => setShowConfirm(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h3>{meeting.title}</h3>
        
        <p className="modal-time">
          {meeting.startTime && meeting.startTime instanceof Date
            ? meeting.startTime.toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })
            : 'No date available'
          }
        </p>

        <div className="modal-section">
          <h4>Summary</h4>
          <p className="modal-text-content whitespace-pre-wrap">
            {cleanSummary(meeting.summary) || 'No summary available.'}
          </p>
        </div>

        <div className="modal-section">
          <h4>Full Transcript</h4>
          <pre className="modal-text-content">
            {meeting.transcript || 'No transcript available.'}
          </pre>
        </div>
        
        <button className="modal-delete-button" onClick={handleDeleteClick}>
          <Trash2 size={16} />
          <span>Delete This Meeting</span>
        </button>

        {showConfirm && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog-box">
              <h4>Permanently Delete?</h4>
              <p>This action cannot be undone. All data for this meeting will be lost.</p>
              <div className="confirm-dialog-buttons">
                <button
                  className="confirm-dialog-button cancel"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="confirm-dialog-button confirm"
                  onClick={handleConfirmDelete}
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingDetailsModal;