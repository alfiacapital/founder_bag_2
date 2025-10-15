import React, { useRef, useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { FaRegSquareCheck, FaRegCopy, FaRectangleList } from "react-icons/fa6";
import { FaSave, FaTasks, FaUserTag } from "react-icons/fa";
import { BiNote } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineCenterFocusStrong, MdMoreVert } from "react-icons/md";
import { IoIosArrowUp } from "react-icons/io";
import { CustomTimeInput, CustomDateInput } from './CustomInputs';
import SubtaskList from './SubtaskList';
import TagUsersModal from './TagUsersModal';
import { NoteEditor } from '@/components/novel-editor';
import { axiosClient } from '@/api/axios';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getUserImage } from '@/utils/getUserImage';
import CreateTemplateFromTaskModal from '@/components/templates/CreateTemplateFromTaskModal';
import SelectTemplateModal from '@/components/templates/SelectTemplateModal';
import TaskDetailModal from './TaskDetailModal';

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
                      onEnterFocusMode,
                      spaceData = []
                  }) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const queryClient = useQueryClient();
    const editInputRef = useRef(null);
    const estimatedDatePickerRef = useRef(null);
    const dueDatePickerRef = useRef(null);
    const menuRef = useRef(null);
    const [showNoteEditor, setShowNoteEditor] = useState(false);
    const [noteContent, setNoteContent] = useState(null);
    const [isNoteExpanded, setIsNoteExpanded] = useState(false);
    const [showTagUsersModal, setShowTagUsersModal] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
    const [showSelectTemplateModal, setShowSelectTemplateModal] = useState(false);
    const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);

    // Initialize note content when editor is shown
    React.useEffect(() => {
        if (showNoteEditor && task.description) {
            try {
                const parsedContent = JSON.parse(task.description);
                setNoteContent(parsedContent);
                // If there's existing content, expand the note editor
                setIsNoteExpanded(true);
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
                // If there's existing content, expand the note editor
                setIsNoteExpanded(true);
            }
        } else if (showNoteEditor) {
            setNoteContent({
                type: "doc",
                content: []
            });
            // If opening a new note, expand the note editor
            setIsNoteExpanded(true);
        }
    }, [showNoteEditor, task.description]);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            // Close menu if clicking outside the menu button or menu itself
            if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

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
            onDragStart={(e) => {
                handleDragStart(e, task);
                // Close menu when starting to drag
                setIsMenuOpen(false);
            }}
            onMouseLeave={() => {
                // Always close menu when mouse leaves the card
                setIsMenuOpen(false);
            }}
            onDoubleClick={() => setShowTaskDetailModal(true)}
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
                        className={`
                task-action-button absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3 pb-1 -translate-y-1/2
                opacity-100 md:opacity-0 md:group-hover:opacity-100
                transform ${isRTL ? 'md:translate-x-2 md:group-hover:translate-x-0' : 'md:-translate-x-2 md:group-hover:translate-x-0'}
                transition-all duration-300 text-dark-text2 hover:text-dark-text1 z-10 cursor-pointer
            `}
                    >
                        <FaRegSquareCheck className="w-4 h-4" />
                    </button>

                    <div className="flex items-center">
                        {/* Task number */}
                        <div className="flex items-center transition-all duration-300">
                            <span className="text-dark-text2 pr-2  flex-shrink-0">{index + 1}</span>
                        </div>

                        {/* Task title */}
                        <div className={`flex items-center transition-all duration-300 ${isRTL ? 'pr-6 md:pr-0 md:group-hover:pr-5' : 'pl-6 md:pl-0 md:group-hover:pl-5'} md:group-hover:max-w-[10rem]`}>
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
                                    className="font-medium text-dark-text1 bg-transparent border-b border-dark-stroke-hover focus:border-dark-text1 focus:outline-none leading-tight  pt-1"
                                    autoFocus
                                />
                            ) : (
                                <h4
                                    className="font-medium text-dark-text1 leading-tight truncate pb-0.5 cursor-pointer hover:text-dark-text1 transition-colors"
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
                <div className={`relative flex items-center ${isRTL ? 'mr-2' : 'ml-2'}`}>
                    {/* Action buttons */}
                    <div
                        className={`
                absolute ${isRTL ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 flex items-center
                opacity-100 md:opacity-0 md:group-hover:opacity-100
                transform ${isRTL ? 'md:-translate-x-2 md:group-hover:translate-x-0' : 'md:translate-x-2 md:group-hover:translate-x-0'}
                transition-all duration-300 z-20
            `}
                    >
                        <div className="relative" ref={menuRef}
                             onMouseLeave={(e) => {
                                 // Don't close menu when hovering over the menu itself
                                 e.stopPropagation();
                             }}>
                            <button
                                title="more actions"
                                className="task-action-button text-dark-text2 hover:text-dark-text1 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                            >
                                <MdMoreVert className="h-5 w-5" />
                            </button>
                            <div className={`absolute right-0 mt-2 w-48 bg-dark-bg2 border border-dark-stroke rounded-md shadow-lg z-30 transition-all duration-200 ${
                                isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                            }`}>
                                <div className="py-1">
                                    {onEnterFocusMode && (
                                        <button
                                            title="focus"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEnterFocusMode(task._id);
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-dark-text2 hover:bg-dark-hover hover:text-dark-text1"
                                        >
                                            <MdOutlineCenterFocusStrong className="h-5 w-5 mr-2" />
                                            <span>Focus Mode</span>
                                        </button>
                                    )}
                                    <button
                                        title="subtasks"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAddingSubtaskFor(task._id);
                                            setNewSubtaskTitle("");
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-dark-text2 hover:bg-dark-hover hover:text-dark-text1"
                                    >
                                        <FaTasks className="h-4 w-4 mr-2" />
                                        <span>Add Subtask</span>
                                    </button>
                                    <button
                                        title="note"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Toggle both the note editor visibility and expanded state
                                            const newShowNoteEditor = !showNoteEditor;
                                            setShowNoteEditor(newShowNoteEditor);
                                            // Only expand the note editor if we're showing it
                                            if (newShowNoteEditor) {
                                                setIsNoteExpanded(true);
                                            }
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-dark-text2 hover:bg-dark-hover hover:text-dark-text1"
                                    >
                                        <BiNote className="h-5 w-5 mr-2" />
                                        <span>{showNoteEditor ? 'Hide Note' : 'Add Note'}</span>
                                    </button>
                                    <button
                                        title="tag users"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowTagUsersModal(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-dark-text2 hover:bg-dark-hover hover:text-dark-text1"
                                    >
                                        <FaUserTag className="h-4 w-4 mr-2" />
                                        <span>Tag Users</span>
                                    </button>
                                    <button
                                        title="save as template"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowCreateTemplateModal(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-dark-text2 hover:bg-dark-hover hover:text-dark-text1"
                                    >
                                        <FaSave className="h-4 w-4 mr-2" />
                                        <span>Save as Template</span>
                                    </button>
                                    <button
                                        title="duplicate"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTaskCopy(task._id);
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-dark-text2 hover:bg-dark-hover hover:text-dark-text1"
                                    >
                                        <FaRegCopy className="h-4 w-4 mr-2" />
                                        <span>Duplicate</span>
                                    </button>
                                    <hr className="border-dark-stroke my-1" />
                                    <button
                                        title="delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTaskDelete(task._id);
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                                    >
                                        <AiOutlineDelete className="h-5 w-5 mr-2" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tagged users avatars */}
                    {task.userIds && task.userIds.length > 0 ? (
                        <div className="flex -space-x-1 opacity-0 md:opacity-100 md:group-hover:opacity-0 transition-opacity duration-300">
                            {task.userIds.slice(0, 2).map((user) => (
                                <img
                                    key={user._id}
                                    src={getUserImage(user.image)}
                                    alt={user.full_name}
                                    title={user.full_name}
                                    className="w-6 h-6 rounded-full border border-dark-stroke object-cover"
                                />
                            ))}
                            {task.userIds.length > 2 && (
                                <div className="w-6 h-6 rounded-full border border-dark-stroke bg-dark-bg flex items-center justify-center">
                                    <span className="text-xs text-dark-text2">+{task.userIds.length - 2}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                //         <img
                //             src={spaceData?.image || "/icon.png"}
                //             alt={task?.title}
                //             className="
                //     w-6 h-6 rounded-button border border-dark-stroke object-cover flex-shrink-0
                //     opacity-0 md:opacity-100 md:group-hover:opacity-0
                //     transition-opacity duration-300
                // "
                //         />

                        task?.spaceId?.image ? (
                            <img
                                src={task?.spaceId?.image || "/icon.png"}
                                className="h-6 w-6 rounded-button border border-dark-stroke object-cover flex-shrink-0 opacity-0 md:opacity-100 md:group-hover:opacity-0 transition-opacity duration-300"
                                alt={task?.spaceId?.name}
                            />
                        ) : task?.spaceId?.color ? (
                            <div className="h-6 w-6 rounded-button border border-dark-stroke  flex-shrink-0 opacity-0 md:opacity-100 md:group-hover:opacity-0 transition-opacity duration-300" style={{ backgroundColor: task?.spaceId?.color}} />
                        ) : (
                            <img
                                src={"/icon.png"}
                                className="h-6 w-6 rounded-button border border-dark-stroke object-cover flex-shrink-0 opacity-0 md:opacity-100 md:group-hover:opacity-0 transition-opacity duration-3300"
                                alt={task?.spaceId?.name}
                            />
                        )
                    )}
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
            
            {/* Note Toggle */}
            {task.description && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-dark-stroke">
                    <span className="text-dark-text2 text-sm font-medium">Note</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Initialize note content if not already done
                            if (noteContent === null) {
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
                            }
                            setIsNoteExpanded(!isNoteExpanded);
                        }}
                        className="text-dark-text2 hover:text-dark-text1 transition-colors"
                        title={isNoteExpanded ? "Collapse note" : "Expand note"}
                    >
                        <IoIosArrowUp 
                            className={`w-5 h-5 transform transition-transform ${isNoteExpanded ? '' : 'rotate-180'}`} 
                        />
                    </button>
                </div>
            )}

            {/* Inline Note Editor */}
            {isNoteExpanded && (
                <div className="mt-3 border-t border-dark-stroke pt-3">
                    <div className="bg-dark-bg text-dark-text1 rounded-lg border border-dark-stroke overflow-hidden" style={{ height: '200px' }}>
                        <NoteEditor
                            key={`note-${task._id}`}
                            onUpdate={handleSaveNote}
                            placeholder="..."
                            autoSave={true}
                            initialContent={noteContent || {
                                type: "doc",
                                content: task.description ? [{
                                    type: "paragraph",
                                    content: [{
                                        type: "text",
                                        text: typeof task.description === 'string' ? task.description : ""
                                    }]
                                }] : []
                            }}
                        />
                    </div>
                </div>
            )}
        </div>

        {/* Tag Users Modal */}
        {showTagUsersModal && (
            <TagUsersModal
                isOpen={showTagUsersModal}
                onClose={() => setShowTagUsersModal(false)}
                task={task}
                spaceData={spaceData}
            />
        )}
        
        {/* Create Template from Task Modal */}
        {showCreateTemplateModal && (
            <CreateTemplateFromTaskModal
                isOpen={showCreateTemplateModal}
                task={task}
                onClose={() => setShowCreateTemplateModal(false)}
                onRefresh={() => queryClient.invalidateQueries('task-templates')}
            />
        )}
        
        {/* Select Template Modal */}
        {showSelectTemplateModal && (
            <SelectTemplateModal
                isOpen={showSelectTemplateModal}
                onClose={() => setShowSelectTemplateModal(false)}
                onTemplateSelected={() => {
                    // Refresh tasks after template import
                    queryClient.invalidateQueries('tasks');
                }}
                spaceId={task.spaceId?._id || task.spaceId}
            />
        )}

        {/* Task Detail Modal */}
        {showTaskDetailModal && (
            <TaskDetailModal
                isOpen={showTaskDetailModal}
                onClose={() => setShowTaskDetailModal(false)}
                task={task}
                onEnterFocusMode={onEnterFocusMode}
                handleTaskComplete={handleTaskComplete}
                handleTaskDelete={handleTaskDelete}
                handleTaskCopy={handleTaskCopy}
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
                noteContent={noteContent}
                isNoteExpanded={isNoteExpanded}
                setIsNoteExpanded={setIsNoteExpanded}
                onSaveNote={handleSaveNote}
                onOpenTagUsers={() => setShowTagUsersModal(true)}
                onOpenCreateTemplate={() => setShowCreateTemplateModal(true)}
                spaceData={spaceData}
            />
        )}
        </>
    );
};

export default TaskCard;
