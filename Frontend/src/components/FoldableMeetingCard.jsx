import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// NOTE: This component is now simplified. It receives its `isOpen` state
// and an `onToggle` function from the parent. This makes the parent
// component the "single source of truth" for which card is open.
export const FoldableMeetingCard = ({ meeting, isOpen, onToggle, onViewDetails }) => {

  return (
    <div 
      id={`meeting-card-${meeting.id}`} // Add ID for scrolling
      className="
        bg-white 
        border border-slate-200 
        rounded-xl 
        shadow-md 
        transition-all duration-300
      "
    >
      {/* ====================================================== */}
      {/* === The Clickable Header: Always Visible === */}
      {/* ====================================================== */}
      <div 
        className="flex justify-between items-center p-6 cursor-pointer" 
        onClick={onToggle} // Use the onToggle function from the parent
      >
        <div>
          <p className="text-base font-bold text-slate-800">
            {meeting.title}
          </p>
          {/* --- THIS IS THE CORRECTED LINE --- */}
          {/* Use the pre-formatted `startTime` Date object */}
          <p className="text-xs font-medium text-slate-500 mt-1">
            {meeting.startTime.toLocaleString()}
          </p>
        </div>
        
        <ChevronDown 
          className={`
            w-5 h-5 text-slate-500 
            transition-transform duration-300
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </div>

      {/* ====================================================== */}
      {/* === The Foldable Content: Conditionally Rendered === */}
      {/* ====================================================== */}
      {isOpen && (
        <div className="px-6 pb-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap mt-4">
            {meeting.summary}
          </p>
          
          {/* Add a "View Details" button */}
          <button 
            onClick={() => onViewDetails(meeting)}
            className="
              mt-4 px-4 py-2 
              bg-blue-500 text-white 
              text-xs font-semibold 
              rounded-lg hover:bg-blue-600 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            "
          >
            View Full Transcript
          </button>
        </div>
      )}
    </div>
  );
};

// It's good practice to export default for components
export default FoldableMeetingCard;