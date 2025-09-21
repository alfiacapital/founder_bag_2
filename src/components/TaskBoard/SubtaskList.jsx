import React from 'react';
import { FiPlus } from "react-icons/fi";
import { IoIosArrowUp } from "react-icons/io";
import SubtaskItem from './SubtaskItem';

const SubtaskList = ({ 
    task, 
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
    setEditSubtaskValue
}) => {
    // Always render if we're adding a subtask for this task, even if no subtasks exist yet
    if (!task?.subtasks?.length && addingSubtaskFor !== task._id) return null;

    return (
        <div className="border-t border-dark-stroke pt-2 mt-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {/* Subtask progress circle */}
                    <svg className="w-4 h-4 mb-1" viewBox="0 0 36 36">
                        <circle
                            className="text-gray-600"
                            cx="18"
                            cy="18"
                            r="16"
                            stroke="#444444"
                            strokeWidth="2"
                            fill="none"
                        />
                        <circle
                            cx="18"
                            cy="18"
                            r="16"
                            stroke="#00FF00"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray={100}
                            strokeDashoffset={100 - ((task?.subtasks?.filter(s => s.status === "completed")?.length || 0) / (task?.subtasks?.length || 1)) * 100}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                        />
                    </svg>

                    <div className="text-dark-text2 font-medium text-sm">
                        {task?.subtasks?.filter(s => s.status === "completed")?.length || 0}/{task?.subtasks?.length || 0} {task?.subtasks?.length === 1 ? 'Subtask' : 'Subtasks'}
                    </div>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setAddingSubtaskFor(task._id);
                            setNewSubtaskTitle("");
                        }}
                        className="text-dark-text2 hover:text-white cursor-pointer pb-1"
                    >
                        <FiPlus className="w-5 h-5" />
                    </button>
                </div>
                
                {task?.subtasks?.length > 0 && (
                    <button
                        className="text-dark-text2 hover:text-white cursor-pointer pb-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleSubtasks(task._id);
                        }}
                    >
                        <IoIosArrowUp
                            className="w-5 h-5 transform transition-transform duration-200"
                            style={{
                                transform: visibleSubtasks[task._id] ? 'rotate(0deg)' : 'rotate(-180deg)',
                            }}
                        />
                    </button>
                )}
            </div>

            {/* Subtask form */}
            {addingSubtaskFor === task._id && (
                <div className="my-2">
                    <input
                        autoFocus
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="subtask title *"
                        className="w-full text-sm border-b border-[#444444] focus:border-white bg-transparent focus:outline-none text-white"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSubtask(task._id);
                            }
                        }}
                        onBlur={() => handleAddSubtask(task._id)}
                    />
                </div>
            )}

            {/* Subtasks List */}
            {(visibleSubtasks[task._id] || addingSubtaskFor === task._id) &&
                task?.subtasks?.length > 0 &&
                task.subtasks
                    .sort((a, b) => a.order - b.order)
                    .map((subtask, key) => (
                        <SubtaskItem
                            key={subtask._id}
                            subtask={subtask}
                            taskId={task._id}
                            index={key}
                            totalSubtasks={task.subtasks.length}
                            editingSubtaskId={editingSubtaskId}
                            editSubtaskValue={editSubtaskValue}
                            setEditingSubtaskId={setEditingSubtaskId}
                            setEditSubtaskValue={setEditSubtaskValue}
                            subtasks={task.subtasks}
                        />
                    ))}
        </div>
    );
};

export default SubtaskList;
