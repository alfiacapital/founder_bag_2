import React from 'react';
import { FaRegSquareCheck } from "react-icons/fa6";
import { CgCloseR } from "react-icons/cg";
import { IoArrowUp, IoArrowDown } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { axiosClient } from "../../api/axios.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const SubtaskItem = ({ 
    subtask, 
    taskId, 
    index, 
    totalSubtasks, 
    editingSubtaskId, 
    editSubtaskValue, 
    setEditingSubtaskId, 
    setEditSubtaskValue,
    subtasks
}) => {
    const queryClient = useQueryClient();

    const handleSubtaskComplete = async (e) => {
        e.stopPropagation();
        try {
            await axiosClient.post(`/tasks/${taskId}/subtasks/${subtask._id}/complete`);
            await queryClient.invalidateQueries("tasks");
        } catch (e) {
            console.log(e);
            toast.error("Failed to complete subtask");
        }
    };

    const handleSubtaskIncomplete = async (e) => {
        e.stopPropagation();
        try {
            await axiosClient.post(`/tasks/${taskId}/subtasks/${subtask._id}/complete`);
            await queryClient.invalidateQueries("tasks");
        } catch (e) {
            console.log(e);
            toast.error("Failed to mark subtask incomplete");
        }
    };

    const handleSubtaskEdit = async () => {
        try {
            await axiosClient.put(`/tasks/${taskId}/subtasks/${subtask._id}`, { 
                title: editSubtaskValue 
            });
            await queryClient.invalidateQueries("tasks");
        } catch (e) {
            console.error(e);
            toast.error("Failed to save subtask title");
        }
        setEditingSubtaskId(null);
    };

    const handleSubtaskKeyDown = async (e) => {
        if (e.key === "Enter") {
            await handleSubtaskEdit();
        }
    };

    const handleMoveUp = async (e) => {
        e.stopPropagation();
        try {
            const newOrder = [...subtasks];
            [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];

            await axiosClient.post(`/tasks/${taskId}/subtasks/reorder`, {
                newOrder: newOrder.map((s, idx) => ({
                    subtaskId: s._id,
                    order: idx + 1,
                })),
            });

            await queryClient.invalidateQueries("tasks");
        } catch (e) {
            console.log(e);
            toast.error("Failed to move subtask up");
        }
    };

    const handleMoveDown = async (e) => {
        e.stopPropagation();
        try {
            const newOrder = [...subtasks];
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];

            await axiosClient.post(`/tasks/${taskId}/subtasks/reorder`, {
                newOrder: newOrder.map((s, idx) => ({
                    subtaskId: s._id,
                    order: idx + 1,
                })),
            });

            await queryClient.invalidateQueries("tasks");
        } catch (e) {
            console.log(e);
            toast.error("Failed to move subtask down");
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            await axiosClient.delete(`/tasks/${taskId}/subtasks/${subtask._id}`);
            await queryClient.invalidateQueries("tasks");
        } catch (e) {
            console.log(e);
            toast.error("Failed to delete subtask");
        }
    };

    return (
        <div className="group/subtask flex justify-between items-center text-dark-text2 px-1 py-0.5 rounded-md hover:bg-dark-hover transition-colors">
            <div className="flex space-x-2">
                {subtask.status === "completed" ? (
                    <button
                        title="incomplete"
                        onClick={handleSubtaskIncomplete}
                        className="text-dark-text2 hover:text-white cursor-pointer transition-all duration-300"
                    >
                        <CgCloseR className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        title="complete"
                        onClick={handleSubtaskComplete}
                        className="text-dark-text2 hover:text-white cursor-pointer transition-all duration-300"
                    >
                        <FaRegSquareCheck className="w-4 h-4" />
                    </button>
                )}

                {editingSubtaskId === subtask._id ? (
                    <input
                        autoFocus
                        type="text"
                        value={editSubtaskValue}
                        onChange={(e) => setEditSubtaskValue(e.target.value)}
                        onBlur={handleSubtaskEdit}
                        onKeyDown={handleSubtaskKeyDown}
                        className={`pt-1 w-full bg-transparent text-dark-text2 border-b border-[#444444] focus:outline-none ${
                            subtask.status === "completed" ? "line-through opacity-50" : ""
                        }`}
                    />
                ) : (
                    <div
                        className={`pt-1 cursor-pointer truncate max-w-[8rem] ${
                            subtask.status === "completed" ? "line-through opacity-50" : ""
                        }`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingSubtaskId(subtask._id);
                            setEditSubtaskValue(subtask.title);
                        }}
                    >
                        {subtask?.title}
                    </div>
                )}
            </div>

            <div className="flex space-x-1">
                {/* Move Up */}
                <button
                    title="move up"
                    disabled={index === 0}
                    onClick={handleMoveUp}
                    className="opacity-0 group-hover/subtask:opacity-100 text-dark-text2 hover:text-white cursor-pointer transition-all duration-300"
                >
                    <IoArrowUp className="h-5 w-5" />
                </button>

                {/* Move Down */}
                <button
                    title="move down"
                    disabled={index === totalSubtasks - 1}
                    onClick={handleMoveDown}
                    className="opacity-0 group-hover/subtask:opacity-100 text-dark-text2 hover:text-white cursor-pointer transition-all duration-300"
                >
                    <IoArrowDown className="h-5 w-5" />
                </button>

                {/* Delete */}
                <button
                    title="delete"
                    onClick={handleDelete}
                    className="opacity-0 group-hover/subtask:opacity-100 text-dark-text2 hover:text-white cursor-pointer transition-all duration-300"
                >
                    <AiOutlineDelete className="h-4.5 w-4.5" />
                </button>
            </div>
        </div>
    );
};

export default SubtaskItem;
