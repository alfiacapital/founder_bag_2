import { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../api/axios.jsx";
import { toast } from "react-toastify";

export const useTaskOperations = (tasks, statuses, setTasks) => {
    const queryClient = useQueryClient();
    const [draggedTask, setDraggedTask] = useState(null);
    const [draggedOverStatus, setDraggedOverStatus] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState("");
    const currentEditValueRef = useRef("");
    const tasksRef = useRef(tasks);

    // Keep tasksRef in sync with tasks
    useEffect(() => {
        tasksRef.current = tasks;
    }, [tasks]);

    const updateTaskMutation = useMutation({
        mutationFn: async ({ taskId, newStatusId }) => {
            return await axiosClient.post(`/task/${taskId}/status`, {
                newStatus: newStatusId
            });
        },
        onMutate: ({ taskId, newStatusId }) => {
            queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previousTasks = [...tasksRef.current];
            const newStatusObj = statuses.find(s => s._id === newStatusId);
            
            // Optimistic update
            setTasks(prev => 
                prev.map(t => 
                    t._id === taskId 
                        ? { ...t, status: newStatusObj }
                        : t
                )
            );
            
            return { previousTasks };
        },
        onError: (err, _variables, context) => {
            if (context?.previousTasks) {
                setTasks(context.previousTasks);
            }
            toast.error(err.message || "Failed to update task");
        },
        onSettled: () => {
            // Don't invalidate queries immediately to preserve optimistic updates
            // The data will be refetched when the component unmounts or when needed
        }
    });

    const completeTaskMutation = useMutation({
        mutationFn: async ({ taskId, newStatusId }) => {
            return await axiosClient.post(`/task/${taskId}/status`, {
                newStatus: newStatusId,
            });
        },
        onMutate: async ({ taskId, newStatusId }) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previousTasks = [...tasksRef.current];
            const newStatusObj = statuses.find((s) => s._id === newStatusId);
            
            // Optimistic update
            setTasks(prev => 
                prev.map(t => 
                    t._id === taskId 
                        ? { ...t, status: newStatusObj }
                        : t
                )
            );
            
            return { previousTasks };
        },
        onError: (err, _variables, context) => {
            if (context?.previousTasks) {
                setTasks(context.previousTasks);
            }
            toast.error(err.message || "Failed to update task");
        },
        onSettled: () => {
            // Don't invalidate queries immediately to preserve optimistic updates
            // The data will be refetched when the component unmounts or when needed
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: async (taskId) => {
            return await axiosClient.delete(`/delete-task/${taskId}`);
        },
        onMutate: async (taskId) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previousTasks = [...tasksRef.current];
            
            // Optimistic update (remove task immediately)
            setTasks(prev => prev.filter(t => t._id !== taskId));
            
            return { previousTasks };
        },
        onError: (err, taskId, context) => {
            if (context?.previousTasks) {
                setTasks(context.previousTasks);
            }
            toast.error(err.message || "Failed to delete task");
        },
        onSettled: () => {
            // Don't invalidate queries immediately to preserve optimistic updates
            // The data will be refetched when the component unmounts or when needed
        },
    });

    const updateTaskFieldMutation = useMutation({
        mutationFn: async ({ taskId, field, value, originalTasks }) => {
            const originalTask = originalTasks.find(t => t._id === taskId);
            return await axiosClient.put(`/edit-task/${taskId}`, {
                title: originalTask.title,
                [field]: value,
                status: originalTask.status._id
            });
        },
        onMutate: async ({ taskId, field, value }) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previousTasks = [...tasksRef.current];
            
            // Optimistic update
            setTasks(prev => 
                prev.map(t => 
                    t._id === taskId 
                        ? { ...t, [field]: value }
                        : t
                )
            );
            
            return { previousTasks };
        },
        onError: (err, _variables, context) => {
            if (context?.previousTasks) {
                setTasks(context.previousTasks);
            }
            toast.error(err.message || "Failed to update task");
        },
        onSettled: () => {
            // Don't invalidate queries immediately to preserve optimistic updates
            // The data will be refetched when the component unmounts or when needed
        },
    });

    const handleDragStart = useCallback((e, task) => {
        if (e.target.closest(".menu-button") || e.target.closest(".task-action-button")) return;
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        e.target.classList.add('opacity-50', 'rotate-1', 'scale-105', 'cursor-grabbing');
    }, []);

    const handleDragOver = useCallback((e, statusId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDraggedOverStatus(statusId);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDraggedOverStatus(null);
    }, []);

    const handleDrop = useCallback((e, statusId) => {
        e.preventDefault();
        if (draggedTask && draggedTask.status?._id !== statusId) {
            updateTaskMutation.mutate({
                taskId: draggedTask._id,
                newStatusId: statusId
            });
        }
        setDraggedTask(null);
        setDraggedOverStatus(null);
        // Remove dragging classes from all elements
        document.querySelectorAll('.opacity-50').forEach(el => {
            el.classList.remove('opacity-50', 'rotate-1', 'scale-105');
        });
    }, [draggedTask, updateTaskMutation]);

    const handleTaskComplete = (taskId) => {
        const status = statuses.find(
            (t) => t.title?.toLowerCase().trim() === "completed"
        );
        if (!status) {
            toast.error("Completed status not found");
            return;
        }
        completeTaskMutation.mutate({ taskId, newStatusId: status._id });
    };

    const handleTaskDelete = (taskId) => {
        deleteTaskMutation.mutate(taskId);
    };

    const handleTaskCopy = async (taskId) => {
        try {
            await axiosClient.put(`/copy-task/${taskId}`);
            await queryClient.invalidateQueries("tasks");
        } catch (e) {
            console.error(e.message);
            toast.error("Failed to copy task");
        }
    };

    const handleEditStart = (taskId, field, currentValue) => {
        setEditingTask(taskId);
        setEditingField(field);
        setEditValue(currentValue || "");
        currentEditValueRef.current = currentValue || "";

        // Auto-open DatePicker for date fields
        if (field === 'estimatedDate' || field === 'dueDate') {
            setTimeout(() => {
                const datePickerInput = document.querySelector('.react-datepicker__input-container input');
                if (datePickerInput) {
                    datePickerInput.click();
                }
            }, 50);
        }
    };

    const handleEditSave = () => {
        if (editingTask && editingField && editValue !== undefined) {
            const originalTasksSnapshot = [...tasksRef.current];
            const originalTask = originalTasksSnapshot.find(t => t._id === editingTask);
            const originalValue = originalTask ? originalTask[editingField] : "";

            updateTaskFieldMutation.mutate({
                taskId: editingTask,
                field: editingField,
                value: currentEditValueRef.current,
                originalValue: originalValue,
                originalTasks: originalTasksSnapshot
            });
        }
        setEditingTask(null);
        setEditingField(null);
        setEditValue("");
    };

    const handleEditCancel = () => {
        setEditingTask(null);
        setEditingField(null);
        setEditValue("");
    };

    const handleEditKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleEditSave();
        } else if (e.key === 'Escape') {
            handleEditCancel();
        }
    };

    return {
        draggedTask,
        draggedOverStatus,
        editingTask,
        editingField,
        editValue,
        setEditValue,
        currentEditValueRef,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleTaskComplete,
        handleTaskDelete,
        handleTaskCopy,
        handleEditStart,
        handleEditSave,
        handleEditCancel,
        handleEditKeyDown
    };
};