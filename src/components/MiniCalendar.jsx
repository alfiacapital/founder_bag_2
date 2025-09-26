import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";

function MiniCalendar({ onDateSelect, selectedDate, isOpen, onClose }) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const calendarRef = useRef(null);

  const handleDateChange = (date) => {
    setCurrentDate(date);
    onDateSelect(date);
    onClose();
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(today);
    onClose();
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={calendarRef}
      className="absolute top-full left-0 mt-2 bg-dark-bg2 border border-dark-stroke rounded-lg shadow-lg z-50 p-4"
      style={{ width: '280px' }}
    >
      {/* React Calendar */}
      <div className="mb-3">
        <Calendar
          onChange={handleDateChange}
          value={currentDate}
          className="react-calendar-custom"
          showNeighboringMonth={false}
          formatShortWeekday={(locale, date) => {
            const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            return weekdays[date.getDay()];
          }}
        />
      </div>
    </div>
  );
}

export default MiniCalendar;
