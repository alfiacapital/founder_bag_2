import { useState, useRef, useEffect } from 'react';
import { axiosClient } from "../api/axios.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useTaskCreation = (id) => {
    const queryClient = useQueryClient();
    const [creatingTaskFor, setCreatingTaskFor] = useState(null);
    const [newTask, setNewTask] = useState({
        title: "",
        estimatedDate: "",
        dueDate: "",
    });
    const createCardRef = useRef(null);

    useEffect(() => {
        async function handleClickOutside(e) {
            // Handle create task card
            if (createCardRef.current && !createCardRef.current.contains(e.target)) {
                // logic to hide or create task
                if (newTask.title.trim()) {
                    if (!newTask.title.trim()) return;

                    try {
                        await axiosClient.post(`/add-user-task/${id}`, {
                            title: newTask.title,
                            estimatedDate: newTask.estimatedDate || null,
                            dueDate: newTask.dueDate || null,
                            status: creatingTaskFor
                        });
                        await queryClient.invalidateQueries("tasks");
                        setCreatingTaskFor(null);
                        setNewTask({ title: "", estimatedDate: "", dueDate: "" });
                    } catch (err) {
                        toast.error(err.message || "Failed to create task");
                    }
                } else if (!newTask.estimatedDate && !newTask.dueDate) {
                    // all empty → hide card
                    setCreatingTaskFor(null);
                    setNewTask({ title: "", estimatedDate: "", dueDate: "" });
                }
                // if estimatedDate or dueDate filled but no title → keep card open
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [creatingTaskFor, id, newTask, queryClient]);

    return {
        creatingTaskFor,
        setCreatingTaskFor,
        newTask,
        setNewTask,
        createCardRef
    };
};
