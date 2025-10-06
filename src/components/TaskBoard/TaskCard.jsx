import React, { useRef, useState } from 'react';
import DatePicker from "react-datepicker";
import { FaRegSquareCheck, FaRegCopy } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { BiNote } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineCenterFocusStrong } from "react-icons/md";
import { CustomTimeInput, CustomDateInput } from './CustomInputs';
import SubtaskList from './SubtaskList';
import { NoteEditor } from '@/components/novel-editor';
import { axiosClient } from '@/api/axios';
import { useQueryClient } from '@tanstack/react-query';

const TaskCard = ({
                      task,
                      index,
                      draggedTask,
                      editingTask,
                      editingField,
                      editValue,
                      setEditValue,
                      currentEditValueRef,
                      handleDragStart,
                      handleTaskComplete,
                      handleTaskDelete,
                      handleTaskCopy,
                      handleEditStart,
                      handleEditSave,
                      handleEditCancel,
                      handleEditKeyDown,
                      visibleSubtasks,
                      toggleSubtasks,
                      addingSubtaskFor,
                      newSubtaskTitle,
                      setNewSubtaskTitle,
                      setAddingSubtaskFor,
                      handleAddSubtask,
                      editingSubtaskId,
                      editSubtaskValue,
                      setEditingSubtaskId,
                      setEditSubtaskValue,
                      onEnterFocusMode
                  }) => {
    const queryClient = useQueryClient();
    const editInputRef = useRef(null);
    const estimatedDatePickerRef = useRef(null);
    const dueDatePickerRef = useRef(null);
    const [showNoteEditor, setShowNoteEditor] = useState(false);
    const [noteContent, setNoteContent] = useState(null);

    // Initialize note content when editor is shown
    React.useEffect(() => {
        if (showNoteEditor && task.description) {
            try {
                const parsedContent = JSON.parse(task.description);
                setNoteContent(parsedContent);
            } catch {
                setNoteContent({
                    type: "doc",
                    content: [{
                        type: "paragraph",
                        content: [{
                            type: "text",
                            text: task.description
                        }]
                    }]
                });
            }
        } else if (showNoteEditor) {
            setNoteContent({
                type: "doc",
                content: []
            });
        }
    }, [showNoteEditor, task.description]);

    const handleSaveNote = async (data) => {
        if (data && data.content) {
            try {
                // Direct API call to update task description using the correct endpoint
                await axiosClient.put(`/edit-task/${task._id}`, {
                    title: task.title,
                    status: task.status._id,
                    description: JSON.stringify(data.content)
                });
                // Invalidate tasks query to refresh data
                queryClient.invalidateQueries('tasks');
            } catch (error) {
                console.error('Error saving note:', error);
            }
        }
    };

    return (
        <>
        <div
            key={task._id}
            draggable
            onDragStart={(e) => handleDragStart(e, task)}
            className={`bg-dark-active rounded-button p-3 sm:p-3 shadow-sm border border-dark-stroke hover:border-dark-stroke hover:shadow-md transition-all duration-200 relative group ${draggedTask ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
            {/* Task Header */}
            <div className="relative flex items-center justify-between mb-3 group">
                {/* Left side with icon and title */}
                <div className="flex items-center relative flex-1 min-w-0">
                    {/* Check icon */}
                    <button
                        title="complete"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTaskComplete(task._id);
                        }}
                        className="
                task-action-button absolute left-3.5 top-3 pb-1 -translate-y-1/2
                opacity-100 md:opacity-0 md:group-hover:opacity-100
                transform md:-translate-x-2 md:group-hover:translate-x-0
                transition-all duration-300 text-dark-text2 hover:text-dark-text1 z-10 cursor-pointer
            "
                    >
                        <FaRegSquareCheck className="w-4 h-4" />
                    </button>

                    <div className="flex items-center">
                        {/* Task number */}
                        <div className="flex items-center transition-all duration-300">
                            <span className="text-dark-text2 pr-2  flex-shrink-0">{index + 1}</span>
                        </div>

                        {/* Task title */}
                        <div className="flex items-center transition-all duration-300 pl-6 md:pl-0 md:group-hover:pl-5 md:group-hover:max-w-[5rem]">
                            {editingTask === task._id && editingField === "title" ? (
                                <input
                                    ref={editInputRef}
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => {
                                        setEditValue(e.target.value);
                                        currentEditValueRef.current = e.target.value;
                                    }}
                                    onKeyDown={handleEditKeyDown}
                                    onBlur={handleEditSave}
                                    className="font-medium text-dark-text1 bg-transparent border-b border-dark-stroke-hover focus:border-dark-text1 focus:outline-none leading-tight max-w-20 md:max-w-42 pt-1"
                                    autoFocus
                                />
                            ) : (
                                <h4
                                    className="font-medium text-dark-text1 leading-tight truncate max-w-16 md:max-w-[10rem] pb-0.5 cursor-pointer hover:text-dark-text1 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditStart(task._id, "title", task.title);
                                    }}
                                >
                                    {task.title}
                                </h4>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right side with actions and image */}
                <div className="relative flex items-center ml-2">
                    {/* Action buttons */}
                    <div
                        className="
                absolute right-0 top-1/2 -translate-y-1/2 flex items-center
                opacity-100 md:opacity-0 md:group-hover:opacity-100
                transform md:translate-x-2 md:group-hover:translate-x-0
                transition-all duration-300 z-20
            "
                    >
                        {onEnterFocusMode && (
                            <button
                                title="focus"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEnterFocusMode(task._id);
                                }}
                                className="task-action-button text-dark-text2  cursor-pointer pr-1.5"
                            >
                                <MdOutlineCenterFocusStrong className="h-5 w-5" />
                            </button>
                        )}
                        <button
                            title="subtasks"
                            onClick={(e) => {
                                e.stopPropagation();
                                setAddingSubtaskFor(task._id);
                                setNewSubtaskTitle("");
                            }}
                            className="task-action-button text-dark-text2 hover:text-dark-text1 cursor-pointer pr-1.5"
                        >
                            <FaTasks className="h-4 w-4" />
                        </button>
                        <button
                            title="note"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowNoteEditor(!showNoteEditor);
                            }}
                            className={`task-action-button cursor-pointer pr-1.5 transition-colors ${
                                showNoteEditor ? 'text-' : 'text-dark-text2 '
                            }`}
                        >
                            <BiNote className="h-5 w-5" />
                        </button>
                        <button
                            title="duplicate"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTaskCopy(task._id);
                            }}
                            className="task-action-button text-dark-text2 hover:text-dark-text1 cursor-pointer pr-1.5"
                        >
                            <FaRegCopy className="h-4 w-4" />
                        </button>
                        <button
                            title="delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTaskDelete(task._id);
                            }}
                            className="task-action-button text-dark-text2 hover:text-dark-text1 cursor-pointer"
                        >
                            <AiOutlineDelete className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Task image */}
                    <img
                        src={task?.spaceId?.image || "/icon.png"}
                        alt={task?.title}
                        className="
                w-6 h-6 rounded-button border border-dark-stroke object-cover flex-shrink-0
                opacity-0 md:opacity-100 md:group-hover:opacity-0
                transition-opacity duration-300
            "
                    />
                </div>
            </div>


            {/* Task Meta */}
            <div className="flex justify-between">
                {/* Estimated Date */}
                <div className="flex items-center space-x-1 text-xs">
                    {editingTask === task._id && editingField === 'estimatedDate' ? (
                        <DatePicker
                            ref={estimatedDatePickerRef}
                            selected={
                                editValue && editValue !== "hh:mm"
                                    ? new Date(`1970-01-01T${editValue}`)
                                    : null
                            }
                            onChange={(date) => {
                                if (date) {
                                    const hours = date.getHours().toString().padStart(2, "0");
                                    const minutes = date.getMinutes().toString().padStart(2, "0");
                                    const timeValue = `${hours}:${minutes}`;
                                    setEditValue(timeValue);
                                    currentEditValueRef.current = timeValue;

                                    // Auto-save after 1 second
                                    setTimeout(() => {
                                        if (editingTask === task._id && editingField === 'estimatedDate') {
                                            handleEditSave();
                                        }
                                    }, 1000);
                                } else {
                                    setEditValue("");
                                    currentEditValueRef.current = "";

                                    // Auto-save after 1 second
                                    setTimeout(() => {
                                        if (editingTask === task._id && editingField === 'estimatedDate') {
                                            handleEditSave();
                                        }
                                    }, 1000);
                                }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="HH:mm"
                            customInput={<CustomTimeInput />}
                            popperPlacement="top-start"
                            autoFocus
                        />
                    ) : (
                        <div
                            className="text-dark-text1 cursor-pointer hover:text-dark-text2 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditStart(task._id, 'estimatedDate', task.estimatedDate);
                            }}
                        >
                            {task.estimatedDate ? (
                                <span>{task.estimatedDate}</span>
                            ) : (
                                <span className="text-dark-text2">hh:mm</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Due Date */}
                <div className="flex items-center space-x-1 text-xs">
                    {editingTask === task._id && editingField === 'dueDate' ? (
                        <DatePicker
                            ref={dueDatePickerRef}
                            selected={editValue ? new Date(editValue) : null}
                            onChange={(date) => {
                                setEditValue(date);
                                currentEditValueRef.current = date;

                                // Auto-save after 1 second
                                setTimeout(() => {
                                    if (editingTask === task._id && editingField === 'dueDate') {
                                        handleEditSave();
                                    }
                                }, 1000);
                            }}
                            placeholderText="Select due date"
                            customInput={<CustomDateInput />}
                            popperPlacement="top-end"
                            autoFocus
                        />
                    ) : (
                        <div
                            className="text-dark-text2 cursor-pointer hover:text-dark-text1 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditStart(task._id, 'dueDate', task.dueDate);
                            }}
                        >
                            {task.dueDate ? (
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            ) : (
                                <span>mm/dd/yyyy</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Subtasks */}
            <SubtaskList
                task={task}
                visibleSubtasks={visibleSubtasks}
                toggleSubtasks={toggleSubtasks}
                addingSubtaskFor={addingSubtaskFor}
                newSubtaskTitle={newSubtaskTitle}
                setNewSubtaskTitle={setNewSubtaskTitle}
                setAddingSubtaskFor={setAddingSubtaskFor}
                handleAddSubtask={handleAddSubtask}
                editingSubtaskId={editingSubtaskId}
                editSubtaskValue={editSubtaskValue}
                setEditingSubtaskId={setEditingSubtaskId}
                setEditSubtaskValue={setEditSubtaskValue}
            />

            {/* Inline Note Editor */}
            {showNoteEditor && noteContent && (
                <div className="mt-3 border-t border-dark-stroke pt-3">
                    <div className="bg-dark-bg rounded-lg border border-dark-stroke overflow-hidden" style={{ height: '200px' }}>
                        <NoteEditor
                            key={`note-${task._id}`}
                            onUpdate={handleSaveNote}
                            placeholder="Add notes for this task..."
                            autoSave={true}
                            initialContent={noteContent}
                        />
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default TaskCard;
