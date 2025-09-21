import { useState } from 'react';
import { axiosClient } from "../api/axios.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useSubtaskOperations = () => {
    const queryClient = useQueryClient();
    const [visibleSubtasks, setVisibleSubtasks] = useState({});
    const [addingSubtaskFor, setAddingSubtaskFor] = useState(null);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [editingSubtaskId, setEditingSubtaskId] = useState(null);
    const [editSubtaskValue, setEditSubtaskValue] = useState("");

    const toggleSubtasks = (taskId) => {
        setVisibleSubtasks((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    const handleAddSubtask = async (taskId) => {
        if (!newSubtaskTitle.trim()) {
            setAddingSubtaskFor(null);
            return;
        }

        try {
            await axiosClient.post(`/tasks/${taskId}/subtasks`, {
                title: newSubtaskTitle.trim()
            });
            await queryClient.invalidateQueries("tasks");
            setNewSubtaskTitle("");
            setAddingSubtaskFor(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to add subtask");
        }
    };

    return {
        visibleSubtasks,
        setVisibleSubtasks,
        addingSubtaskFor,
        setAddingSubtaskFor,
        newSubtaskTitle,
        setNewSubtaskTitle,
        editingSubtaskId,
        setEditingSubtaskId,
        editSubtaskValue,
        setEditSubtaskValue,
        toggleSubtasks,
        handleAddSubtask
    };
};
