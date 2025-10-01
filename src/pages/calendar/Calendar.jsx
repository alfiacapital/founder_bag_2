import React, {useEffect, useState} from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "../../calendar.css"
import 'react-calendar/dist/Calendar.css';
import CalendarFooter from "@/parts/CalendarFooter.jsx";
import CustomToolbar from "@/pages/calendar/comp/CustomToolbar.jsx";
import CustomDateCellWrapper from "@/pages/calendar/comp/CustomDateCellWrapper.jsx";
import SidebarCalendar from "@/pages/calendar/comp/SidebarCalendar.jsx";
import Modal from "@/components/Modal.jsx";
import EventForm from "@/pages/calendar/comp/EventForm.jsx";
import { axiosClient } from "@/api/axios.jsx";


const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

// Wrap Calendar with drag and drop functionality
const DragAndDropCalendar = withDragAndDrop(Calendar);

export default function CalendarPage() {
    const [currentView, setCurrentView] = useState("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showMiniCalendar, setShowMiniCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showSidebar, setShowSidebar] = useState(() => {
        return window.innerWidth >= 768;
    });
    
    // Event management state
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const MonthDateCellWrapper = ({ value, children }) => {
        return <CustomDateCellWrapper value={value} children={children} view="month" currentDate={currentDate} />;
    };

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

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

    // Fetch all events from backend
    const fetchEvents = async () => {
        try {
            const response = await axiosClient.get("/events");
            // Convert date strings to Date objects
            const formattedEvents = response.data.map(event => ({
                ...event,
                id: event._id,
                start: new Date(event.start),
                end: new Date(event.end),
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
            alert("Failed to fetch events");
        }
    };

    // Handle slot selection (creating new event)
    const handleSelectSlot = ({ start, end }) => {
        setSelectedSlot({ start, end });
        setSelectedEvent(null);
        setIsModalOpen(true);
    };

    // Handle event click (editing existing event)
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setSelectedSlot(null);
        setIsModalOpen(true);
    };

    // Create or update event
    const handleSubmitEvent = async (eventData) => {
        setIsLoading(true);
        try {
            if (selectedEvent) {
                // Update existing event
                const response = await axiosClient.put(`/events/${selectedEvent.id}`, eventData);
                const updatedEvent = {
                    ...response.data,
                    id: response.data._id,
                    start: new Date(response.data.start),
                    end: new Date(response.data.end),
                };
                setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));
            } else {
                // Create new event
                const response = await axiosClient.post("/events", eventData);
                const newEvent = {
                    ...response.data,
                    id: response.data._id,
                    start: new Date(response.data.start),
                    end: new Date(response.data.end),
                };
                setEvents([...events, newEvent]);
            }
            setIsModalOpen(false);
            setSelectedSlot(null);
            setSelectedEvent(null);
        } catch (error) {
            console.error("Error saving event:", error);
            alert(error.response?.data?.message || "Failed to save event");
        } finally {
            setIsLoading(false);
        }
    };

    // Delete event
    const handleDeleteEvent = async (eventId) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        
        try {
            await axiosClient.delete(`/events/${eventId}`);
            setEvents(events.filter(e => e.id !== eventId));
            setIsModalOpen(false);
            setSelectedEvent(null);
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSlot(null);
        setSelectedEvent(null);
    };

    // Handle drag and drop event move
    const onEventDrop = async ({ event, start, end }) => {
        try {
            // Update on backend
            const response = await axiosClient.put(`/events/${event.id}`, {
                title: event.title,
                start,
                end,
                allDay: event.allDay,
            });

            // Update local state
            const formattedEvent = {
                ...response.data,
                id: response.data._id,
                start: new Date(response.data.start),
                end: new Date(response.data.end),
            };

            setEvents(events.map(e => e.id === event.id ? formattedEvent : e));
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Failed to move event");
        }
    };

    // Handle event resize
    const onEventResize = async ({ event, start, end }) => {
        try {
            // Update on backend
            const response = await axiosClient.put(`/events/${event.id}`, {
                title: event.title,
                start,
                end,
                allDay: event.allDay,
            });

            // Update local state
            const formattedEvent = {
                ...response.data,
                id: response.data._id,
                start: new Date(response.data.start),
                end: new Date(response.data.end),
            };

            setEvents(events.map(e => e.id === event.id ? formattedEvent : e));
        } catch (error) {
            console.error("Error resizing event:", error);
            alert("Failed to resize event");
        }
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
                <DragAndDropCalendar
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
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    onEventDrop={onEventDrop}
                    onEventResize={onEventResize}
                    resizable
                    draggableAccessor={() => true}
                />

                <CalendarFooter />
            </div>

            {/* Event Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg">
                <EventForm
                    event={selectedEvent}
                    start={selectedSlot?.start}
                    end={selectedSlot?.end}
                    onSubmit={handleSubmitEvent}
                    onClose={handleCloseModal}
                    isLoading={isLoading}
                />
                {selectedEvent && (
                    <div className="mt-4 pt-4 border-t border-[#444444]">
                        <button
                            onClick={() => handleDeleteEvent(selectedEvent.id)}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete Event
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
