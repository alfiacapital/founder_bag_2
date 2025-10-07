import React, {useState} from "react";
import {FaPlus} from "react-icons/fa6";
import {format} from "date-fns";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import ReactCalendar from "react-calendar";
import { useTranslation } from "react-i18next";

export default function SidebarCalendar({ selectedDate, onDateSelect, setCurrentDate }) {
    const { t, i18n } = useTranslation("global");
    const [viewDate, setViewDate] = useState(selectedDate);

    const handleDateChange = (date) => {
        onDateSelect(date);
        setCurrentDate(date);
    };

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        setViewDate(newDate);
    };

    return (
        <div className="bg-dark-bg2">
            <div className="border border-dark-stroke text-dark-text2 rounded-button px-4 pb-2 pt-3 w-fit hover:text-dark-text1 hover:bg-dark-hover hover:border-dark-stroke cursor-pointer capitalize my-6 mt-4 md:mt-20 flex items-center gap-2">
                <FaPlus className="w-4 h-4 mb-1" />
                <span className="text-md font-medium">{t('create')}</span>
            </div>
            {/* Custom Header */}
            <div className="flex items-center justify-between mb-4 px-2">

                <h3 className="text-dark-text1 font-medium text-sm">
                    {format(viewDate, "MMMM yyyy")}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 text-dark-text1 hover:bg-dark-hover rounded-full transition-colors cursor-pointer"
                    >
                        <IoIosArrowBack className="w-4 h-4 rtl:rotate-180" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 text-dark-text1 hover:bg-dark-hover rounded-full transition-colors cursor-pointer"
                    >
                        <IoIosArrowForward className="w-4 h-4 rtl:rotate-180" />
                    </button>
                </div>
            </div>

            <ReactCalendar
                onChange={handleDateChange}
                value={selectedDate}
                activeStartDate={viewDate}
                onActiveStartDateChange={({ activeStartDate }) => setViewDate(activeStartDate)}
                className="react-calendar-custom"
                showNeighboringMonth={false}
                showNavigation={false}
                formatShortWeekday={(locale, date) => {
                    const weekdays = i18n.dir() === "rtl" ? ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                    return weekdays[date.getDay()];
                }}
            />
        </div>
    );
}

