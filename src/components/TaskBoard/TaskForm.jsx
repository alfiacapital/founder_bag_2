import React from 'react';
import DatePicker from "react-datepicker";
import { CustomTimeInput, CustomDateInput } from './CustomInputs';

const TaskForm = ({ 
    createCardRef, 
    newTask, 
    setNewTask 
}) => {
    return (
        <div
            ref={createCardRef}
            className="bg-dark-active rounded-button p-3 sm:p-3 shadow-sm border border-dark-stroke hover:border-dark-stroke hover:shadow-md transition-all duration-200 relative group mb-3"
        >
            {/* Title */}
            <input
                placeholder="Title *"
                className="w-full pb-0.5 focus:outline-none border-b border-[#1f1f1f] focus:border-[#444444]"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                autoFocus
            />

            {/* Meta fields */}
            <div className="flex justify-between mt-4 relative z-50">
                {/* Estimated time */}
                <DatePicker
                    selected={newTask.estimatedDate ? new Date(`1970-01-01T${newTask.estimatedDate}`) : null}
                    onChange={(date) => {
                        if (date) {
                            const hours = date.getHours().toString().padStart(2, "0");
                            const minutes = date.getMinutes().toString().padStart(2, "0");
                            setNewTask({ ...newTask, estimatedDate: `${hours}:${minutes}` });
                        } else {
                            setNewTask({ ...newTask, estimatedDate: "" });
                        }
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    customInput={<CustomTimeInput />}
                />

                {/* due date */}
                <DatePicker
                    selected={newTask.dueDate}
                    onChange={(date) => setNewTask({ ...newTask, dueDate: date })}
                    placeholderText="Select due date"
                    customInput={<CustomDateInput />}
                    popperPlacement="bottom-start"
                />
            </div>
        </div>
    );
};

export default TaskForm;
