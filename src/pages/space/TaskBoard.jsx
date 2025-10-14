import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../api/axios.jsx";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineCenterFocusStrong } from "react-icons/md";
import StatusColumn from "../../components/TaskBoard/StatusColumn";
import { useTaskOperations } from "../../hooks/useTaskOperations";
import { useSubtaskOperations } from "../../hooks/useSubtaskOperations";
import { useTaskCreation } from "../../hooks/useTaskCreation";


function TaskBoard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    
    // Queries
    const { data, isError, isLoading } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => await axiosClient.get(`/user-tasks/${id}`),
        select: res => res.data || [],
        onError: (err) => toast.error(err.message || "Failed to get tasks")
    });

    console.log(data);

    const { data: statuses = [], isError: spacesError } = useQuery({
        queryKey: ["status"],
        queryFn: async () => await axiosClient.get(`/tasks/status/${id}`),
        select: res => res.data,
        onError: (err) => toast.error(err.message || "Failed to get statuses")
    });

    useEffect(() => {
        if (data && JSON.stringify(data) !== JSON.stringify(tasks)) {
            setTasks(data)
        }
    }, [data]);

    // Custom hooks
    const taskOperations = useTaskOperations(tasks, statuses, setTasks);
    const subtaskOperations = useSubtaskOperations();
    const taskCreation = useTaskCreation(id);

    // Group tasks by status
    const tasksByStatus = tasks.reduce((acc, task) => {
        const statusId = task.status?._id || 'unassigned';
        if (!acc[statusId]) {
            acc[statusId] = [];
        }
        acc[statusId].push(task);
        return acc;
    }, {});

    // Get all incomplete tasks for focus mode
    const incompleteTasks = tasks.filter(task => task.status?.title !== 'done' && task.status?.title !== 'completed');

    // Focus mode handler - opens in new window on the right
    const handleEnterFocusMode = (taskId = null) => {
        const targetTaskId = taskId || incompleteTasks[0]?._id;
        if (targetTaskId) {
            // Calculate window dimensions and position (20% width, right side)
            const screenWidth = window.screen.availWidth;
            const screenHeight = window.screen.availHeight;
            const focusWindowWidth = Math.floor(screenWidth * 0.2); // 20% for focus mode
            const leftPosition = screenWidth - focusWindowWidth; // Position on the right
            
            // Open focus mode window on the right (20%)
            const focusUrl = `/space/${id}/focus?taskId=${targetTaskId}`;
            const windowFeatures = `width=${focusWindowWidth},height=${screenHeight},left=${leftPosition},top=0,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no`;
            
            const newWindow = window.open(focusUrl, 'FocusMode', windowFeatures);
            
            if (newWindow) {
                newWindow.focus();
                
                // Show helpful tip about window arrangement
                toast.info(
                    <div>
                        <div className="font-semibold mb-1">Focus Mode Opened! 🎯</div>
                        <div className="text-xs">
                            Windows Key + ← to snap this window left
                            <br />
                            (Or drag this window to the left edge)
                        </div>
                    </div>,
                    { autoClose: 5000 }
                );
            } else {
                toast.error("Please allow pop-ups for Focus Mode");
            }
        } else {
            toast.info("No tasks available for focus mode");
        }
    };

    // Loading and error states
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isError || spacesError) {
        return navigate("/");
    }

    return (
        <div className="bg-dark-bg max-h-screen ">
            <div className="h-full flex flex-col">
                {/* Task Board - Responsive Grid */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden sm:pr-4 rtl:pl-4">
                    <div className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 min-w-min">
                        {statuses.slice(0, 4).map((status) => (
                            <StatusColumn
                                key={status._id}
                                status={status}
                                tasksByStatus={tasksByStatus}
                                draggedTask={taskOperations.draggedTask}
                                draggedOverStatus={taskOperations.draggedOverStatus}
                                creatingTaskFor={taskCreation.creatingTaskFor}
                                setCreatingTaskFor={taskCreation.setCreatingTaskFor}
                                newTask={taskCreation.newTask}
                                setNewTask={taskCreation.setNewTask}
                                createCardRef={taskCreation.createCardRef}
                                editingTask={taskOperations.editingTask}
                                editingField={taskOperations.editingField}
                                editValue={taskOperations.editValue}
                                setEditValue={taskOperations.setEditValue}
                                currentEditValueRef={taskOperations.currentEditValueRef}
                                handleDragOver={taskOperations.handleDragOver}
                                handleDragLeave={taskOperations.handleDragLeave}
                                handleDrop={taskOperations.handleDrop}
                                handleDragStart={taskOperations.handleDragStart}
                                handleTaskComplete={taskOperations.handleTaskComplete}
                                handleTaskDelete={taskOperations.handleTaskDelete}
                                handleTaskCopy={taskOperations.handleTaskCopy}
                                handleEditStart={taskOperations.handleEditStart}
                                handleEditSave={taskOperations.handleEditSave}
                                handleEditCancel={taskOperations.handleEditCancel}
                                handleEditKeyDown={taskOperations.handleEditKeyDown}
                                visibleSubtasks={subtaskOperations.visibleSubtasks}
                                toggleSubtasks={subtaskOperations.toggleSubtasks}
                                addingSubtaskFor={subtaskOperations.addingSubtaskFor}
                                newSubtaskTitle={subtaskOperations.newSubtaskTitle}
                                setNewSubtaskTitle={subtaskOperations.setNewSubtaskTitle}
                                setAddingSubtaskFor={subtaskOperations.setAddingSubtaskFor}
                                handleAddSubtask={subtaskOperations.handleAddSubtask}
                                editingSubtaskId={subtaskOperations.editingSubtaskId}
                                editSubtaskValue={subtaskOperations.editSubtaskValue}
                                setEditingSubtaskId={subtaskOperations.setEditingSubtaskId}
                                setEditSubtaskValue={subtaskOperations.setEditSubtaskValue}
                                onEnterFocusMode={handleEnterFocusMode}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskBoard;