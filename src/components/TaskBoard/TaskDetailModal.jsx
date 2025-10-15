import React from 'react';
import Modal from '@/components/Modal';
import { MdOutlineCenterFocusStrong } from 'react-icons/md';
import { FaRegSquareCheck, FaRegCopy } from 'react-icons/fa6';
import { FaSave, FaTasks, FaUserTag } from 'react-icons/fa';
import { BiNote } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoIosArrowUp } from 'react-icons/io';
import { NoteEditor } from '@/components/novel-editor';
import TaskDetailsPanel from './TaskDetailsPanel';
import { axiosClient } from '@/api/axios';
import { useQueryClient } from '@tanstack/react-query';

const TaskDetailModal = ({
    isOpen,
    onClose,
    task,
    // actions
    onEnterFocusMode,
    handleTaskComplete,
    handleTaskDelete,
    handleTaskCopy,
    // subtasks props
    addingSubtaskFor,
    newSubtaskTitle,
    setNewSubtaskTitle,
    setAddingSubtaskFor,
    handleAddSubtask,
    editingSubtaskId,
    editSubtaskValue,
    setEditingSubtaskId,
    setEditSubtaskValue,
    // note editor
    noteContent,
    isNoteExpanded,
    setIsNoteExpanded,
    onSaveNote,
    // tagging users modal
    onOpenTagUsers,
    onOpenCreateTemplate
}) => {
    const queryClient = useQueryClient();
    const [isEditingTitle, setIsEditingTitle] = React.useState(false);
    const [titleValue, setTitleValue] = React.useState(task?.title || "");

    React.useEffect(() => {
        setTitleValue(task?.title || "");
    }, [task?.title]);

    const handleSaveTitle = async () => {
        const trimmed = (titleValue || '').trim();
        if (!trimmed || trimmed === task.title) {
            setIsEditingTitle(false);
            return;
        }
        try {
            await axiosClient.put(`/edit-task/${task?._id}`, {
                title: trimmed,
                status: task?.status?._id || task?.status,
                description: task?.description,
            });
            await queryClient.invalidateQueries('tasks');
        } catch (err) {
            console.error('Error saving title:', err);
        } finally {
            setIsEditingTitle(false);
        }
    };
    if (!task) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <div className="flex flex-col gap-3 p-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        {/* <button
                            title="complete"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTaskComplete(task._id);
                            }}
                            className="text-dark-text2 hover:text-dark-text1"
                        >
                            <FaRegSquareCheck className="w-4 h-4" />
                        </button> */}
                        {isEditingTitle ? (
                            <input
                                autoFocus
                                value={titleValue}
                                onChange={(e) => setTitleValue(e.target.value)}
                                onBlur={handleSaveTitle}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveTitle();
                                    if (e.key === 'Escape') setIsEditingTitle(false);
                                }}
                                className="font-semibold text-dark-text1 bg-transparent border-b border-dark-stroke focus:outline-none max-w-[60vw] sm:max-w-[32rem]"
                                placeholder="Task title"
                            />
                        ) : (
                            <h3
                                className="text-dark-text1 font-semibold truncate max-w-[60vw] sm:max-w-[32rem] cursor-text hover:text-dark-text2"
                                onClick={() => setIsEditingTitle(true)}
                                title="Click to edit title"
                            >
                                {task.title}
                            </h3>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {onEnterFocusMode && (
                            <button
                                title="Focus Mode"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEnterFocusMode(task._id);
                                }}
                                className="text-dark-text2 hover:text-dark-text1"
                            >
                                <MdOutlineCenterFocusStrong className="h-5 w-5" />
                            </button>
                        )}
                        <button
                            title="Add Subtask"
                            onClick={(e) => {
                                e.stopPropagation();
                                setAddingSubtaskFor(task._id);
                                setNewSubtaskTitle("");
                            }}
                            className="text-dark-text2 hover:text-dark-text1"
                        >
                            <FaTasks className="h-4 w-4" />
                        </button>
                        <button
                            title="Note"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsNoteExpanded(!isNoteExpanded);
                            }}
                            className="text-dark-text2 hover:text-dark-text1"
                        >
                            <BiNote className="h-5 w-5" />
                        </button>
                        <button
                            title="Tag Users"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenTagUsers();
                            }}
                            className="text-dark-text2 hover:text-dark-text1"
                        >
                            <FaUserTag className="h-4 w-4" />
                        </button>
                        <button
                            title="Save as Template"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenCreateTemplate && onOpenCreateTemplate();
                            }}
                            className="text-dark-text2 hover:text-dark-text1"
                        >
                            <FaSave className="h-4 w-4" />
                        </button>
                        <button
                            title="Duplicate"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTaskCopy(task._id);
                            }}
                            className="text-dark-text2 hover:text-dark-text1"
                        >
                            <FaRegCopy className="h-4 w-4" />
                        </button>
                        <button
                            title="Delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTaskDelete(task._id);
                                onClose();
                            }}
                            className="text-red-500 hover:text-red-400"
                        >
                            <AiOutlineDelete className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-dark-text2">
                    <div className="flex items-center gap-2">
                        {task?.spaceId?.image ? (
                            <img src={task.spaceId.image} alt={task?.spaceId?.name} className="h-6 w-6 rounded-button border border-dark-stroke object-cover" />
                        ) : task?.spaceId?.color ? (
                            <div className="h-6 w-6 rounded-button border border-dark-stroke" style={{ backgroundColor: task.spaceId.color }} />
                        ) : null}
                        <span className="truncate max-w-[40vw] sm:max-w-[20rem]">{task?.spaceId?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>{task.estimatedDate || 'hh:mm'}</span>
                        <span>•</span>
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'mm/dd/yyyy'}</span>
                    </div>
                </div>

                {/* Content: left details, right note (responsive) */}
                <div className="grig grid-cols-12">
                    <div className="">
                        <TaskDetailsPanel
                            task={task}
                            editingSubtaskId={editingSubtaskId}
                            editSubtaskValue={editSubtaskValue}
                            setEditingSubtaskId={setEditingSubtaskId}
                            setEditSubtaskValue={setEditSubtaskValue}
                            addingSubtaskFor={addingSubtaskFor}
                            setAddingSubtaskFor={setAddingSubtaskFor}
                            newSubtaskTitle={newSubtaskTitle}
                            setNewSubtaskTitle={setNewSubtaskTitle}
                            handleAddSubtask={handleAddSubtask}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default TaskDetailModal;


