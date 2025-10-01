import {format, startOfMonth, startOfWeek} from "date-fns";
import React from "react";

export default function CustomDateCellWrapper({ value, children, range, currentDate }) {
    const isToday = format(value, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    
    // Get the first day shown in the calendar (could be from previous month)
    // Use the currentDate (the calendar's current month) to calculate the calendar start
    const monthStart = startOfMonth(currentDate || value);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
    
    // Calculate if this date is in the first row (first 7 days of the calendar view)
    const daysDiff = Math.floor((value.getTime() - calendarStart.getTime()) / (1000 * 60 * 60 * 24));
    const showDayName = daysDiff >= 0 && daysDiff < 7;

    return (
        <div className={`w-full border-r flex flex-col items-center justify-center !border-[#1f1f1f] pt-2 ${isToday ? 'bg-dark-bg2' : ''}`}>
            {showDayName && (
                <div className="text-sm font-bold text-dark-text-2 mb-0">
                    {format(value, "EEE")}
                </div>
            )}
            <div className={`text-sm font-bold mb-0 ${isToday ? 'text-white  rounded-full px-2 py-1' : 'text-dark-text-2'}`}>
                {format(value, "d")}
            </div>

            {children}
        </div>
    );
}
