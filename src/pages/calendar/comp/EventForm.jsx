import React, { useState, useEffect } from "react";
import { format } from "date-fns";

export default function EventForm({ event, start, end, onSubmit, onClose, isLoading }) {
    const [formData, setFormData] = useState({
        title: "",
        start: "",
        end: "",
        allDay: false,
    });

    useEffect(() => {
        if (event) {
            // Editing existing event
            setFormData({
                title: event.title || "",
                start: event.start ? format(new Date(event.start), "yyyy-MM-dd'T'HH:mm") : "",
                end: event.end ? format(new Date(event.end), "yyyy-MM-dd'T'HH:mm") : "",
                allDay: event.allDay || false,
            });
        } else if (start && end) {
            // Creating new event from slot selection
            setFormData({
                title: "",
                start: format(new Date(start), "yyyy-MM-dd'T'HH:mm"),
                end: format(new Date(end), "yyyy-MM-dd'T'HH:mm"),
                allDay: false,
            });
        }
    }, [event, start, end]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.title.trim()) {
            alert("Please enter a title");
            return;
        }

        if (!formData.start || !formData.end) {
            alert("Please select start and end times");
            return;
        }

        const startDate = new Date(formData.start);
        const endDate = new Date(formData.end);

        if (endDate < startDate) {
            alert("End time cannot be before start time");
            return;
        }

        onSubmit({
            ...formData,
            start: startDate,
            end: endDate,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">
                {event ? "Edit Event" : "Create Event"}
            </h2>

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-dark-text2 mb-2">
                    Event Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-bg text-white border border-[#444444] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                    required
                />
            </div>

            {/* Start Date/Time */}
            <div>
                <label htmlFor="start" className="block text-sm font-medium text-dark-text2 mb-2">
                    Start Date & Time *
                </label>
                <input
                    type="datetime-local"
                    id="start"
                    name="start"
                    value={formData.start}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-bg text-white border border-[#444444] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* End Date/Time */}
            <div>
                <label htmlFor="end" className="block text-sm font-medium text-dark-text2 mb-2">
                    End Date & Time *
                </label>
                <input
                    type="datetime-local"
                    id="end"
                    name="end"
                    value={formData.end}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-bg text-white border border-[#444444] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* All Day Toggle */}
            {/* <div className="flex items-center">
                <input
                    type="checkbox"
                    id="allDay"
                    name="allDay"
                    checked={formData.allDay}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-500 bg-dark-bg border-[#444444] rounded focus:ring-blue-500"
                />
                <label htmlFor="allDay" className="ml-2 text-sm text-dark-text2">
                    All Day Event
                </label>
            </div> */}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-dark-bg border border-[#444444] text-dark-text2 rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

