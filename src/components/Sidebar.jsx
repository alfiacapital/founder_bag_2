import React from "react";
import MiniCalendar from "./MiniCalendar.jsx";

function Sidebar({ isOpen, onClose, selectedDate, onDateSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 h-full w-80 bg-dark-bg border-r border-[#1f1f1f] z-40">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-[#1f1f1f]">
        <h2 className="text-white font-medium text-lg">Calendar</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl transition-colors"
        >
          ×
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <MiniCalendar
          isOpen={true}
          onClose={onClose}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </div>
    </div>
  );
}

export default Sidebar;
