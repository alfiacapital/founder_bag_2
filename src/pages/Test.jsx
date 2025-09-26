import React, {useEffect, useRef, useState} from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../calendar.css"
import {IoIosArrowBack, IoIosArrowDown, IoIosArrowForward} from "react-icons/io";
import Menu from "@/components/Menu.jsx";
import {services} from "@/parts/Navbar.jsx";
import MiniCalendar from "@/components/MiniCalendar.jsx";
import { TbMenu2 } from "react-icons/tb";


const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const events = [
  {
    id: 1,
    title: "Meeting",
    start: new Date(2025, 8, 24, 11, 0),
    end: new Date(2025, 8, 24, 12, 0),
  },
];

function CustomToolbar({ label, onNavigate, onView, view, onOpenMiniCalendar, showMiniCalendar, selectedDate, setSelectedDate, setCurrentDate, setShowMiniCalendar }) {
  const [open, setOpen] = useState(false)
  const toolbarRef = useRef(null);
  let darkMode = true;

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);  return (
      <div ref={toolbarRef} className=" flex justify-between items-center bg-dark-bg2 text-white py-4 px-3">
          <div className={"flex items-center gap-4"}>
            
            <div>
              <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center space-x-2 border border-dark-stroke
                     rounded-lg px-4 pb-1.5 pt-2 hover:border-dark-stroke
                     transition"
              >
                {darkMode ? (
                    <img src={"/ALFIA_SYSTEM.png"} alt="Logo" className="h-8 " />
                ) : (
                    <img src={"/ALFIA_SYSTEM_DARK.png"} alt="Logo" className="h-8" />
                )}
                <IoIosArrowDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown Cards with transition */}
              <div
                  className={`absolute left-0 mt-3 w-[700px] bg-dark-bg 
                      border border-dark-stroke 
                      rounded-button shadow-lg p-3 grid grid-cols-2 gap-2 z-50
                      transform transition-all duration-300 ease-out
                      ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
              >
                {services.map((service, idx) => (
                    <div
                        onClick={() => {
                          if (service.url) window.open(service.url, "_blank"), setOpen(false);
                        }}
                        key={idx}
                        className="flex flex-col justify-start h-[120px] bg-dark-bg2
                           border border-dark-stroke hover:border-dark-stroke
                           rounded-button px-4 py-3 cursor-pointer transition "
                    >
                      <div className="flex flex-col">
                                <span className="text-lg font-semibold text-navy-900 dark:text-white ">
                                    {service.name}
                                </span>
                      </div>
                    </div>
                ))}
              </div>
            </div>
            <div onClick={() => onNavigate("TODAY")}
                className={"border border-dark-stroke text-dark-text2 rounded-button px-4 pb-2 pt-3 hover:text-white hover:bg-dark-hover hover:border-dark-stroke cursor-pointer"}>
              <span className={"text-md font-medium"}>Today</span>
            </div>
            <div onClick={() => onNavigate("PREV")} className={"p-2 text-dark-text2 hover:text-white hover:bg-dark-hover rounded-full cursor-pointer"}>
              <IoIosArrowBack className={"h-6 w-6"} />
            </div>
            <div onClick={() => onNavigate("NEXT")} className={"p-2 text-dark-text2 hover:text-white hover:bg-dark-hover rounded-full cursor-pointer"}>
              <IoIosArrowForward className={"h-6 w-6"} />
            </div>
            <div className="relative">
              <div 
                className={"font-medium text-dark-text2 mt-2 text-xl cursor-pointer hover:text-white transition-colors"}
                onClick={onOpenMiniCalendar}
                title="Click to select date"
              >
                {label}
              </div>
              <MiniCalendar
                isOpen={showMiniCalendar}
                onClose={() => setShowMiniCalendar(false)}
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setCurrentDate(date);
                }}
              />
            </div>
          </div>

          <div className={"flex items-center gap-4"}>
            <Menu
                button={
                  <button className="border border-dark-stroke text-dark-text2 rounded-button px-4 pb-2 pt-3 hover:text-white hover:bg-dark-hover hover:border-dark-stroke cursor-pointer capitalize">
                    {view}
                  </button>
                }
                items={[
                  {
                    label: "Month",
                    onClick: () => onView("month"),
                  },
                  {
                    label: "Week",
                    onClick: () => onView("week"),
                  },
                  {
                    label: "Day",
                    onClick: () => onView("day"),
                  },
                ]}
            />
          </div>
      </div>
  );
}


function CustomDateCellWrapper({ value, children }) {
  const isToday =
      format(value, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  // Show day names only in month view and only for the first 7 days of the CURRENT month
  const currentDate = new Date();
  const isCurrentMonth = value.getMonth() === currentDate.getMonth() && value.getFullYear() === currentDate.getFullYear();
  const showDayName = isCurrentMonth && value.getDate() <= 7;

  return (
      <div className="w-full border-l border-[#444444] p-2">
        {showDayName && (
          <div className="text-sm font-bold text-dark-text-2 mb-0">
            {format(value, "EEE")}
          </div>
        )}

        {children}
      </div>
  );
}

function MonthDateCellWrapper({ value, children }) {
  return <CustomDateCellWrapper value={value} children={children} view="month" />;
}

// Custom Week View using TimeGrid

export default function MyCalendar() {
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div style={{ height: "100vh" }} className={`px-[0.5px] pb-[0.5px] bg-dark-bg text-dark-text2`} >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={currentView}
        date={currentDate}
        onView={(view) => setCurrentView(view)}
        onNavigate={(date, view) => {
          setCurrentDate(date);
          setCurrentView(view);
        }}
        components={{
          toolbar: (props) => (
            <CustomToolbar 
              {...props} 
              onOpenMiniCalendar={() => setShowMiniCalendar(true)}
              showMiniCalendar={showMiniCalendar}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setCurrentDate={setCurrentDate}
              setShowMiniCalendar={setShowMiniCalendar}
            />
          ),
          dateCellWrapper: currentView === 'month' ? MonthDateCellWrapper : undefined,
          header: currentView === 'month' ? () => null : undefined,
        }}
        style={{ height: "100%" }}
      />
    </div>
  );
}
