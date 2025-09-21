import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../api/axios.jsx";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
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
        <div className="bg-dark-">
            <div className="">
                {/* Task Board */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statuses.slice(0, 3).map((status) => (
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
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TaskBoard;
