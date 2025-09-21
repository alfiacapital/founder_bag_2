import React, {useState, useCallback, useEffect, useRef, forwardRef} from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../api/axios.jsx";
import { toast } from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import {FaArrowDown, FaArrowUp, FaRegCopy, FaTasks} from "react-icons/fa";
import {AiOutlineDelete} from "react-icons/ai";
import {BiNote} from "react-icons/bi";
import {FaRegSquareCheck} from "react-icons/fa6";
import {MdDone} from "react-icons/md";
import DatePicker from "react-datepicker";
import {IoIosArrowRoundDown, IoIosArrowRoundUp, IoIosArrowUp} from "react-icons/io";
import {CgCloseR} from "react-icons/cg";
import {IoArrowDown, IoArrowUp} from "react-icons/io5";

const CustomTimeInput = React.forwardRef(({ value, onClick }, ref) => (
    <span
        ref={ref}
        onClick={onClick}
        className="text-dark-text2 cursor-pointer text-xs"
    >
    {value || "hh:mm"}
  </span>
));
CustomTimeInput.displayName = "CustomTimeInput";

const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <span
        ref={ref}
        onClick={onClick}
        className="text-dark-text2 cursor-pointer text-xs"
    >
    {value || "mm/dd/yyyy"}
  </span>
));
CustomDateInput.displayName = "CustomDateInput";


function TaskBoard() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [draggedTask, setDraggedTask] = useState(null);
    const [draggedOverStatus, setDraggedOverStatus] = useState(null);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([])
    const [creatingTaskFor, setCreatingTaskFor] = useState(null);
    const [newTask, setNewTask] = useState({
        title: "",
        estimatedDate: "",
        dueDate: "",
    });
    const [editingTask, setEditingTask] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState("");
    const createCardRef = useRef(null);
    const editInputRef = useRef(null);
    const currentEditValueRef = useRef("");
    const estimatedDatePickerRef = useRef(null);
    const dueDatePickerRef = useRef(null);
    const [addingSubtaskFor, setAddingSubtaskFor] = useState(null);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [editingSubtaskId, setEditingSubtaskId] = useState(null); // currently editing subtask
    const [editSubtaskValue, setEditSubtaskValue] = useState("");    // input value
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
                        await queryClient.invalidateQueries("tasks")
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

            // Handle edit input - simplified approach
            if (editingTask && editingField) {
                // Only handle click outside for title field (text input)
                if (editingField === 'title' && editInputRef.current && !editInputRef.current.contains(e.target)) {
                    handleEditSave();
                }
                // For DatePicker fields, we use auto-save timeout instead of click outside
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [creatingTaskFor, id, newTask, queryClient, editingTask, editingField]);


    const { data, isError, isLoading } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => await axiosClient.get(`/user-tasks/${id}`),
        select: res => res.data || [],
        onError: (err) => toast.error(err.message || "Failed to get tasks")
    });

    useEffect(() => {
        if (data && data !== tasks) {
            setTasks(data)
        }
    }, [data, tasks]);


    const { data: statuses = [], isError: spacesError } = useQuery({
        queryKey: ["status"],
        queryFn: async () => await axiosClient.get(`/tasks/status/${id}`),
        select: res => res.data,
        onError: (err) => toast.error(err.message || "Failed to get statuses")
    });

    const [visibleSubtasks, setVisibleSubtasks] = useState({});

    const toggleSubtasks = (taskId) => {
        setVisibleSubtasks((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    const updateTaskMutation = useMutation({
        mutationFn: async ({ taskId, newStatusId }) => {
            return await axiosClient.post(`/task/${taskId}/status`, {
                newStatus: newStatusId
            });
        },
        onMutate: ({ taskId, newStatusId }) => {
            queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previousTasks = tasks;
            setTasks((prev) =>
                prev.map((t) =>
                    t._id === taskId
                        ? { ...t, status: statuses.find(s => s._id === newStatusId) }
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
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
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

            const previousTasks = tasks;

            const newStatusObj = statuses.find((s) => s._id === newStatusId);

            setTasks((prev) =>
                prev.map((t) =>
                    t._id === taskId ? { ...t, status: newStatusObj } : t
                )
            );

            return { previousTasks };
        },
        onError: (err, _variables, context) => {
            if (context?.previousTasks) {
                setTasks(context.previousTasks); // rollback
            }
            toast.error(err.message || "Failed to update task");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: async (taskId) => {
            return await axiosClient.delete(`/delete-task/${taskId}`);
        },
        onMutate: async (taskId) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });

            // snapshot old tasks
            const previousTasks = tasks;

            // optimistic update (remove task immediately)
            setTasks((prev) => prev.filter((t) => t._id !== taskId));

            return { previousTasks };
        },
        onError: (err, taskId, context) => {
            if (context?.previousTasks) {
                // rollback if API fails
                setTasks(context.previousTasks);
            }
            toast.error(err.message || "Failed to delete task");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
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

            const previousTasks = tasks;

            setTasks((prev) =>
                prev.map((t) =>
                    t._id === taskId ? { ...t, [field]: value } : t
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
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });


    const tasksByStatus = tasks.reduce((acc, task) => {
        const statusId = task.status?._id || 'unassigned';
        if (!acc[statusId]) {
            acc[statusId] = [];
        }
        acc[statusId].push(task);
        return acc;
    }, {});

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
        let previousTasks = tasks;

        try {
            // optimistic task
            const original = tasks.find((t) => t._id === taskId);
            if (original) {
                const optimisticTask = {
                    ...original,
                    _id: "temp-" + Date.now(),
                    title: `${original.title} (Copy)`,
                };

                // add at the beginning
                setTasks((prev) => [optimisticTask, ...prev]);
            }

            await axiosClient.put(`/copy-task/${taskId}`);
            await queryClient.invalidateQueries("tasks");
        } catch (e) {
            console.error(e.message);
            setTasks(previousTasks);
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
            // Capture the original tasks state before any mutations
            const originalTasksSnapshot = [...tasks];
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

    const handleAddSubtask = async (taskId) => {
        if (!newSubtaskTitle.trim()) {
            setAddingSubtaskFor(null);
            return;
        }

        try {
            await axiosClient.post(`/tasks/${taskId}/subtasks`, {
                title: newSubtaskTitle.trim()
            });
            await queryClient.invalidateQueries("tasks")

            setNewSubtaskTitle("");
            setAddingSubtaskFor(null);
        } catch (err) {
            console.error(err);
        }
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isError || spacesError) {
        return navigate("/")
    }


    return (
        <div className="bg-dark-">
            <div className="">
                {/* Task Board */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statuses.slice(0, 3).map((status) => (
                        <div
                            key={status._id}
                            className={`rounded-default border border-dashed border-dark-stroke p-4 min-h-[500px] transition-all duration-300 bg-dark-bg2 `}
                            onDragOver={(e) => handleDragOver(e, status._id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, status._id)}
                        >
                            {/* Status Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold text-dark-text1 capitalize">{status.title}</h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setCreatingTaskFor(status._id)}
                                    className="text-dark-text2 hover:text-white cursor-pointer pb-1">
                                    <FiPlus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* create task card */}
                            {creatingTaskFor === status._id && (
                                <div
                                    ref={createCardRef}
                                    className={`bg-dark-active rounded-button p-3 sm:p-3 shadow-sm border border-dark-stroke hover:border-dark-stroke hover:shadow-md transition-all duration-200 relative group mb-3`}
                                >
                                    {/* Title */}
                                    <input
                                        placeholder="Title *"
                                        className="w-full pb-0.5 focus:outline-none border-b border-[#1f1f1f] focus:border-[#444444]"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        autoFocus
                                    />

                                    {/* Meta fields */}
                                    <div className="flex justify-between mt-4 relative z-50">
                                        {/* Estimated time */}
                                        <DatePicker
                                            selected={newTask.estimatedDate ? new Date(`1970-01-01T${newTask.estimatedDate}`) : null}
                                            onChange={(date) => {
                                                if (date) {
                                                    const hours = date.getHours().toString().padStart(2, "0");
                                                    const minutes = date.getMinutes().toString().padStart(2, "0");
                                                    setNewTask({ ...newTask, estimatedDate: `${hours}:${minutes}` });
                                                } else {
                                                    setNewTask({ ...newTask, estimatedDate: "" });
                                                }
                                            }}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="HH:mm"
                                            customInput={<CustomTimeInput />}
                                        />

                                        {/* due date */}
                                        <DatePicker
                                            selected={newTask.dueDate}
                                            onChange={(date) => setNewTask({ ...newTask, dueDate: date })}
                                            placeholderText="Select due date"
                                            customInput={<CustomDateInput />}
                                            popperPlacement="bottom-start"
                                        />

                                    </div>
                                </div>
                            )}


                            {/* Tasks */}
                            <div className="space-y-3">
                                {tasksByStatus[status._id]?.map((task, key) => (
                                    <div
                                        key={task._id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task)}
                                        className={`bg-dark-active rounded-button p-3 sm:p-3 shadow-sm border border-dark-stroke hover:border-dark-stroke hover:shadow-md transition-all duration-200 relative group ${draggedTask ? 'cursor-grabbing' : 'cursor-grab'}`}
                                    >
                                        {/* Task Header */}
                                        <div className="relative flex items-center justify-between mb-3">
                                            {/* Left side with icon and title */}
                                            <div className="flex items-center relative flex-1 min-w-0">
                                                {/* Animated check icon */}
                                                <button title={"complete"}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTaskComplete(task._id);
                                                    }}
                                                    className="task-action-button absolute left-3 top-1/2 pb-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-dark-text2 hover:text-white z-10 cursor-pointer"
                                                >
                                                    <FaRegSquareCheck className="w-4 h-4" />
                                                </button>

                                                <div className={"flex items-center"}>
                                                    {/* Task number and title */}
                                                    <div className="flex items-center transition-all duration-300 ">
                                                        <span className="text-dark-text2 pr-2 flex-shrink-0">{key + 1}</span>
                                                    </div>

                                                    <div className="flex items-center transition-all duration-300 group-hover:pl-5  group-hover:max-w-[4rem]">
                                                        {editingTask === task._id && editingField === 'title' ? (
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
                                                                className="font-medium text-dark-text1 bg-transparent border-b border-[#444444] focus:border-white focus:outline-none leading-tight max-w-42 pt-1"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <h4
                                                                className="font-medium text-dark-text1 text- leading-tight truncate max-w-[10rem]  pt-1 cursor-pointer hover:text-white transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditStart(task._id, 'title', task.title);
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
                                                {/* Action buttons container */}
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center  opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-20">
                                                    <button title="subtasks"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAddingSubtaskFor(task._id);
                                                                setNewSubtaskTitle("");
                                                            }}
                                                        className="task-action-button text-dark-text2 hover:text-white cursor-pointer pr-1.5  "
                                                    >
                                                        <FaTasks className="h-4 w-4" />
                                                    </button>
                                                    <button title={"note"}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                        className="task-action-button text-dark-text2 hover:text-white cursor-pointer pr-1.5 "
                                                    >
                                                        <BiNote className="h-5 w-5" />
                                                    </button>
                                                    <button title={"duplicate"}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTaskCopy(task._id)
                                                        }}
                                                        className="task-action-button text-dark-text2 hover:text-white cursor-pointer pr-1.5 "
                                                    >
                                                        <FaRegCopy className="h-4 w-4" />
                                                    </button>
                                                    <button title={"delete"}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTaskDelete(task._id);
                                                        }}
                                                        className="task-action-button text-dark-text2 hover:text-white cursor-pointer  "
                                                    >
                                                        <AiOutlineDelete className="h-5 w-5" />
                                                    </button>
                                                </div>

                                                {/* Task image */}
                                                <img
                                                    src={task?.spaceId?.image || "/icon.png"}
                                                    alt={task?.title}
                                                    className="w-6 h-6 rounded-button border border-[#444444] object-cover group-hover:opacity-0 transition-opacity duration-300 flex-shrink-0"
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
                                                        className="text-white cursor-pointer hover:text-gray-300 transition-colors"
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
                                                        className="text-dark-text2 cursor-pointer hover:text-white transition-colors"
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

                                        {task?.subtasks?.length > 0 && (
                                            <div className={"border-t border-dark-stroke pt-2 mt-2"}>
                                                <div className={"flex justify-between items-center "}>
                                                    <div className={"flex  items-center space-x-2"}>
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
                                                                strokeDasharray={100} // 100% of circle
                                                                strokeDashoffset={100 - ((task?.subtasks?.filter(s => s.status === "completed")?.length || 0) / (task?.subtasks?.length || 1)) * 100}
                                                                strokeLinecap="round"
                                                                transform="rotate(-90 18 18)"
                                                            />
                                                        </svg>

                                                        <div className={"text-dark-text2 font-medium text-sm"}>
                                                            {task?.subtasks?.filter(s => s.status === "completed")?.length || 0}/{task?.subtasks?.length} {task?.subtasks?.length === 1 ? 'Subtask' : 'Subtasks'}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAddingSubtaskFor(task._id);
                                                                setNewSubtaskTitle("");
                                                            }}
                                                            className="text-dark-text2 hover:text-white cursor-pointer pb-1">
                                                            <FiPlus className="w-5 h-5" />
                                                        </button>
                                                    </div>
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

                                                </div>
                                            </div>
                                        )}
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
                                        {visibleSubtasks[task._id] &&
                                            task?.subtasks?.length > 0 &&
                                            task.subtasks
                                                .sort((a, b) => a.order - b.order) // ensure current order
                                                .map((subtask, key) => (
                                                    <div
                                                        key={subtask._id}
                                                        className="group/subtask flex justify-between items-center text-dark-text2 px-1 py-0.5 rounded-md hover:bg-dark-hover transition-colors"
                                                    >
                                                        <div className="flex space-x-2">
                                                            {subtask.status === "completed" ? (
                                                                <button
                                                                    title="incomplete"
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();
                                                                        try {
                                                                            await axiosClient.post(
                                                                                `/tasks/${task._id}/subtasks/${subtask._id}/complete`
                                                                            );
                                                                            await queryClient.invalidateQueries("tasks");
                                                                        } catch (e) {
                                                                            console.log(e);
                                                                            toast.error("Failed to mark subtask incomplete");
                                                                        }
                                                                    }}
                                                                    className="text-dark-text2 hover:text-white cursor-pointer transition-all duration-300"
                                                                >
                                                                    <CgCloseR className="w-4 h-4" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    title="complete"
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();
                                                                        try {
                                                                            await axiosClient.post(
                                                                                `/tasks/${task._id}/subtasks/${subtask._id}/complete`
                                                                            );
                                                                            await queryClient.invalidateQueries("tasks");
                                                                        } catch (e) {
                                                                            console.log(e);
                                                                            toast.error("Failed to complete subtask");
                                                                        }
                                                                    }}
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
                                                                    onBlur={async () => {
                                                                        try {
                                                                            await axiosClient.put(`/tasks/${task._id}/subtasks/${subtask._id}`, { title: editSubtaskValue });
                                                                            await queryClient.invalidateQueries("tasks");
                                                                        } catch (e) {
                                                                            console.error(e);
                                                                            toast.error("Failed to save subtask title");
                                                                        }
                                                                        setEditingSubtaskId(null);
                                                                    }}
                                                                    onKeyDown={async (e) => {
                                                                        if (e.key === "Enter") {
                                                                            try {
                                                                                await axiosClient.put(`/tasks/${task._id}/subtasks/${subtask._id}`, { title: editSubtaskValue });
                                                                                await queryClient.invalidateQueries("tasks");
                                                                            } catch (e) {
                                                                                console.error(e);
                                                                                toast.error("Failed to save subtask title");
                                                                            }
                                                                            setEditingSubtaskId(null);
                                                                        }
                                                                    }}
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
                                                                disabled={key === 0} // first item cannot move up
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    try {
                                                                        const newOrder = [...task.subtasks];
                                                                        [newOrder[key - 1], newOrder[key]] = [newOrder[key], newOrder[key - 1]];

                                                                        await axiosClient.post(`/tasks/${task._id}/subtasks/reorder`, {
                                                                            newOrder: newOrder.map((s, index) => ({
                                                                                subtaskId: s._id,
                                                                                order: index + 1,
                                                                            })),
                                                                        });

                                                                        await queryClient.invalidateQueries("tasks");
                                                                    } catch (e) {
                                                                        console.log(e);
                                                                        toast.error("Failed to move subtask up");
                                                                    }
                                                                }}
                                                                className="opacity-0 group-hover/subtask:opacity-100 text-dark-text2 hover:text-white cursor-pointer transition-all duration-300"
                                                            >
                                                                <IoArrowUp className="h-5 w-5" />
                                                            </button>

                                                            {/* Move Down */}
                                                            <button
                                                                title="move down"
                                                                disabled={key === task.subtasks.length - 1} // last item cannot move down
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    try {
                                                                        const newOrder = [...task.subtasks];
                                                                        [newOrder[key], newOrder[key + 1]] = [newOrder[key + 1], newOrder[key]];

                                                                        await axiosClient.post(`/tasks/${task._id}/subtasks/reorder`, {
                                                                            newOrder: newOrder.map((s, index) => ({
                                                                                subtaskId: s._id,
                                                                                order: index + 1,
                                                                            })),
                                                                        });

                                                                        await queryClient.invalidateQueries("tasks");
                                                                    } catch (e) {
                                                                        console.log(e);
                                                                        toast.error("Failed to move subtask down");
                                                                    }
                                                                }}
                                                                className="opacity-0 group-hover/subtask:opacity-100 text-dark-text2 hover:text-white cursor-pointer transition-all duration-300"
                                                            >
                                                                <IoArrowDown className="h-5 w-5" />
                                                            </button>

                                                            {/* Delete */}
                                                            <button
                                                                title="delete"
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    try {
                                                                        await axiosClient.delete(`/tasks/${task._id}/subtasks/${subtask._id}`);
                                                                        await queryClient.invalidateQueries("tasks");
                                                                    } catch (e) {
                                                                        console.log(e);
                                                                        toast.error("Failed to delete subtask");
                                                                    }
                                                                }}
                                                                className="opacity-0 group-hover/subtask:opacity-100 text-dark-text2 hover:text-white cursor-pointer transition-all duration-300"
                                                            >
                                                                <AiOutlineDelete className="h-4.5 w-4.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                    </div>
                                ))}

                                {/* Empty State */}
                                {(!tasksByStatus[status._id] || tasksByStatus[status._id].length === 0) && (
                                    <div className="flex flex-col items-center justify-center flex-1 text-center space-y-3 mt-40">
                                        <div className="border border-[#444444] p-2 rounded-full">
                                            <MdDone className="text-dark-text2 text-md" />
                                        </div>
                                        <p className="text-dark-text2 font-medium text-sm">ALL CLEAR</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TaskBoard;
