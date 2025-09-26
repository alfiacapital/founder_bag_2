import React, {useEffect, useRef, useState} from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../calendar.css"
import {IoIosArrowBack, IoIosArrowDown, IoIosArrowForward} from "react-icons/io";
import Menu from "@/components/Menu.jsx";
import {services} from "@/parts/Navbar.jsx";
import MiniCalendar from "@/components/MiniCalendar.jsx";
import { TbMenu2 } from "react-icons/tb";
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaPlus } from "react-icons/fa6";
import CalendarFooter from "@/parts/CalendarFooter.jsx";


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
        start: new Date(2025, 8, 1, 11, 0),
        end: new Date(2025, 8, 1, 12, 0),
    },
];

function CustomToolbar({ label, onNavigate, onView, view, onOpenMiniCalendar, showMiniCalendar, selectedDate, setSelectedDate, setCurrentDate, setShowMiniCalendar, onOpenSidebar }) {
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
        <div>
            <div ref={toolbarRef} className="fixed top-0 left-0 right-0 z-999   flex justify-between items-center bg-dark-bg2  text-white py-4 px-3  ">
                <div className={"flex items-center gap-4"}>
                    {/* Sidebar Toggle Button */}
                    <div
                        className="p-2 text-dark-text2 hover:text-white hover:bg-dark-hover rounded-full cursor-pointer"
                        onClick={onOpenSidebar}
                        title="Open Sidebar"
                    >
                        <TbMenu2 className="w-6 h-6" />
                    </div>

                    <div>
                        <button
                            onClick={() => setOpen(!open)}
                            className="hidden md:flex items-center space-x-2 border border-dark-stroke
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
                         className={"hidden md:flex border border-dark-stroke text-dark-text2 rounded-button px-4 pb-2 pt-3 hover:text-white hover:bg-dark-hover hover:border-dark-stroke cursor-pointer"}>
                        <span className={"text-md font-medium"}>Today</span>
                    </div>
                    <div onClick={() => onNavigate("PREV")} className={"hidden md:flex p-2 text-dark-text2 hover:text-white hover:bg-dark-hover rounded-full cursor-pointer"}>
                        <IoIosArrowBack className={"h-6 w-6"} />
                    </div>
                    <div onClick={() => onNavigate("NEXT")} className={"hidden md:flex p-2 text-dark-text2 hover:text-white hover:bg-dark-hover rounded-full cursor-pointer"}>
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
        </div>
    );
}


function CustomDateCellWrapper({ value, children }) {
    const isToday = format(value, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    const currentDate = new Date();
    const isCurrentMonth = value.getMonth() === currentDate.getMonth() && value.getFullYear() === currentDate.getFullYear();
    const showDayName = isCurrentMonth && value.getDate() <= 7;

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

function MonthDateCellWrapper({ value, children }) {
    return <CustomDateCellWrapper value={value} children={children} view="month" />;
}

function SidebarCalendar({ selectedDate, onDateSelect, currentDate, setCurrentDate }) {
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
            <div className="border border-dark-stroke text-dark-text2 rounded-button px-4 pb-2 pt-3 w-fit hover:text-white hover:bg-dark-hover hover:border-dark-stroke cursor-pointer capitalize my-6 mt-4 md:mt-20 flex items-center gap-2">
                <FaPlus className="w-4 h-4 mb-1" />
                <span className="text-md font-medium">Create</span>
            </div>
            {/* Custom Header */}
            <div className="flex items-center justify-between mb-4 px-2">

                <h3 className="text-white font-medium text-sm">
                    {format(viewDate, "MMMM yyyy")}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 text-white hover:bg-dark-hover rounded-full transition-colors cursor-pointer"
                    >
                        <IoIosArrowBack className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 text-white hover:bg-dark-hover rounded-full transition-colors cursor-pointer"
                    >
                        <IoIosArrowForward className="w-4 h-4" />
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
                    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                    return weekdays[date.getDay()];
                }}
            />
        </div>
    );
}


export default function CalendarPage() {
    const [currentView, setCurrentView] = useState("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showMiniCalendar, setShowMiniCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showSidebar, setShowSidebar] = useState(() => {
        return window.innerWidth >= 768;
    });

    useEffect(() => {
        const handleResize = () => {
            setShowSidebar(window.innerWidth >= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const getLabel = () => {
        return format(currentDate, "MMMM yyyy");
    };

    return (
        <div className="h-screen overflow-hidden bg-dark-bg2 text-dark-text2">
            {/* Fixed Toolbar */}
            <div className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${showSidebar && window.innerWidth >= 768 ? 'ml-70' : 'ml-0'}`}>
                <CustomToolbar
                    label={getLabel()}
                    onNavigate={(action) => {
                        if (action === "TODAY") {
                            setCurrentDate(new Date());
                        } else if (action === "PREV") {
                            if (currentView === "month") {
                                setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
                            } else if (currentView === "week") {
                                setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
                            } else if (currentView === "day") {
                                setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
                            }
                        } else if (action === "NEXT") {
                            if (currentView === "month") {
                                setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
                            } else if (currentView === "week") {
                                setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
                            } else if (currentView === "day") {
                                setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
                            }
                        }
                    }}
                    onView={(view) => setCurrentView(view)}
                    view={currentView}
                    onOpenMiniCalendar={() => setShowMiniCalendar(true)}
                    showMiniCalendar={showMiniCalendar}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    setCurrentDate={setCurrentDate}
                    setShowMiniCalendar={setShowMiniCalendar}
                    onOpenSidebar={() => setShowSidebar(!showSidebar)}
                />
            </div>

            {/* Sidebar - Desktop */}
            {showSidebar && window.innerWidth >= 768 && (
                <div className="fixed top-0 left-0 w-70 h-full bg-[#070707] z-20 p-4 px-7 overflow-y-auto">
                    <div className="">
                        <SidebarCalendar
                            selectedDate={selectedDate}
                            onDateSelect={(date) => {
                                setSelectedDate(date);
                                setCurrentDate(date);
                            }}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                        />
                    </div>
                </div>
            )}


            {/* Mobile Drawer */}
            {showSidebar && window.innerWidth < 768 && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 backdrop-blur-[2px] bg-opacity-50 z-40"
                        onClick={() => setShowSidebar(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed top-0 left-0 w-70 h-full bg-[#070707] z-50 p-4 px-7 overflow-y-auto transform transition-transform duration-300 ease-in-out">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white font-medium text-lg">Calendar</h2>
                            <button
                                onClick={() => setShowSidebar(false)}
                                className="text-gray-400 hover:text-white text-xl transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        <div className="">
                            <SidebarCalendar
                                selectedDate={selectedDate}
                                onDateSelect={(date) => {
                                    setSelectedDate(date);
                                    setCurrentDate(date);
                                }}
                                currentDate={currentDate}
                                setCurrentDate={setCurrentDate}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Calendar Content */}
            <div className={`pt-20 transition-all duration-300 ${showSidebar && window.innerWidth >= 768 ? 'ml-70' : 'ml-0'} flex-1 flex flex-col overflow-hidden`}>
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
                        toolbar: () => null, // Hide the default toolbar
                        dateCellWrapper: currentView === 'month' ? MonthDateCellWrapper : undefined,
                        header: currentView === 'month' ? () => null : undefined,
                    }}
                    style={{ height: "calc(100vh - 80px - 70px)", overflow: "hidden" }}
                />
                <CalendarFooter />
            </div>
        </div>
    );
}
