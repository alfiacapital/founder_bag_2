import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../api/axios.jsx";
import { toast } from "react-toastify";
import { IoPlay, IoPause, IoRefresh, IoChevronBack, IoChevronForward, IoCheckmark, IoClose, IoAdd, IoRemove } from "react-icons/io5";
import { FaRegSquareCheck } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";

const FocusModePage = () => {
    const { id: spaceId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskIdFromUrl = searchParams.get('taskId');
    const queryClient = useQueryClient();

    // Simple timer states
    const [duration, setDuration] = useState(25); // minutes
    const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
    const [isRunning, setIsRunning] = useState(false);
    const [completedSessions, setCompletedSessions] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [editingTime, setEditingTime] = useState(false);
    const [tempDuration, setTempDuration] = useState('');

    const audioRef = useRef(null);

    // Fetch tasks
    const { data: tasks = [], isError, isLoading } = useQuery({
        queryKey: ["tasks", spaceId],
        queryFn: async () => await axiosClient.get(`/user-tasks/${spaceId}`),
        select: res => res.data || [],
        onError: (err) => toast.error(err.message || "Failed to get tasks")
    });

    // Get incomplete tasks
    const incompleteTasks = tasks.filter(task => 
        task.status?.title !== 'done' && task.status?.title !== 'completed'
    );

    const [currentTaskId, setCurrentTaskId] = useState(taskIdFromUrl || incompleteTasks[0]?._id);
    const currentTask = incompleteTasks.find(t => t._id === currentTaskId);
    const currentTaskIndex = incompleteTasks.findIndex(t => t._id === currentTaskId);

    // Load settings
    useEffect(() => {
        const saved = localStorage.getItem('focusModeSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            setDuration(settings.duration || 25);
            setSoundEnabled(settings.soundEnabled ?? true);
            setCompletedSessions(settings.completedSessions || 0);
        }
    }, []);

    // Save settings
    useEffect(() => {
        localStorage.setItem('focusModeSettings', JSON.stringify({
            duration,
            soundEnabled,
            completedSessions
        }));
    }, [duration, soundEnabled, completedSessions]);

    // Timer logic
    useEffect(() => {
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            handleTimerComplete();
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const handleTimerComplete = () => {
        setIsRunning(false);
        
        if (soundEnabled && audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio failed'));
        }

        const newCount = completedSessions + 1;
        setCompletedSessions(newCount);
        toast.success(`🎉 Session ${newCount} completed!`);
        setTimeLeft(duration * 60);
    };

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        setTimeLeft(duration * 60);
        setIsRunning(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Update document title
    useEffect(() => {
        document.title = `${formatTime(timeLeft)} - Focus`;
        return () => { document.title = 'Task Manager'; };
    }, [timeLeft]);

    // Duration editing
    const startEditing = () => {
        setEditingTime(true);
        setTempDuration(duration.toString());
    };

    const saveDuration = () => {
        const value = parseInt(tempDuration) || 1;
        const clampedValue = Math.max(1, Math.min(120, value));
        setDuration(clampedValue);
        if (!isRunning) setTimeLeft(clampedValue * 60);
        setEditingTime(false);
        toast.success('Time updated! ⏱️');
    };

    const adjustDuration = (delta) => {
        const newValue = Math.max(1, Math.min(120, duration + delta));
        setDuration(newValue);
        if (!isRunning) setTimeLeft(newValue * 60);
    };

    // Task mutations
    const completeMutation = useMutation({
        mutationFn: (taskId) => axiosClient.put(`/tasks/complete/${taskId}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks"]);
            toast.success("Task completed! ✅");
        },
        onError: (err) => toast.error(err.message || "Failed to complete task")
    });

    const deleteMutation = useMutation({
        mutationFn: (taskId) => axiosClient.delete(`/tasks/${taskId}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks"]);
            toast.success("Task deleted!");
        },
        onError: (err) => toast.error(err.message || "Failed to delete task")
    });

    const handleTaskComplete = (taskId) => {
        completeMutation.mutate(taskId);
        handleNextTask();
    };

    const handleTaskDelete = (taskId) => {
        deleteMutation.mutate(taskId);
        if (incompleteTasks.length > 1) {
            handleNextTask();
        } else {
            toast.info("No more tasks");
            setTimeout(() => navigate(`/space/${spaceId}/board`), 2000);
        }
    };

    const handleNextTask = () => {
        if (currentTaskIndex < incompleteTasks.length - 1) {
            setCurrentTaskId(incompleteTasks[currentTaskIndex + 1]._id);
        }
    };

    const handlePreviousTask = () => {
        if (currentTaskIndex > 0) {
            setCurrentTaskId(incompleteTasks[currentTaskIndex - 1]._id);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !editingTime) {
                navigate(`/space/${spaceId}/board`);
            } else if (e.key === ' ' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                toggleTimer();
            } else if (e.key === 'ArrowRight' && currentTaskIndex < incompleteTasks.length - 1) {
                e.preventDefault();
                handleNextTask();
            } else if (e.key === 'ArrowLeft' && currentTaskIndex > 0) {
                e.preventDefault();
                handlePreviousTask();
            } else if (e.key === 'Enter' && editingTime) {
                saveDuration();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentTaskIndex, incompleteTasks.length, editingTime, isRunning]);

    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
            </div>
        );
    }

    if (isError || !currentTask) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-dark-text1 text-lg">No tasks available</p>
                    <button
                        onClick={() => navigate(`/space/${spaceId}/board`)}
                        className="px-8 py-3 bg-dark-active hover:bg-dark-hover text-white rounded-button font-semibold transition-all border border-dark-stroke"
                    >
                        Back to Tasks
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col">
            <audio ref={audioRef} src="/alarm-clock-90867.mp3" preload="auto"></audio>

            {/* Header */}
            <div className="bg-dark-bg2 border-b border-dark-stroke px-3 py-3">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => window.close()}
                            className="p-1.5 text-dark-text2 hover:text-dark-text1 hover:bg-dark-active rounded-button transition-all"
                            title="Close (ESC)"
                        >
                            <IoClose className="w-5 h-5" />
                        </button>
                        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-dark-text2'}`}></div>
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`p-1.5 rounded-button transition-all ${soundEnabled ? 'text-dark-text1' : 'text-dark-text2'}`}
                        >
                            {soundEnabled ? <BiVolumeFull className="w-4 h-4" /> : <BiVolumeMute className="w-4 h-4" />}
                        </button>
                    </div>
                    <div className="text-center">
                        <span className="text-dark-text1 font-semibold text-sm">Focus</span>
                        <div className="text-dark-text2 text-xs">{completedSessions} sessions</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-3 overflow-y-auto">
                <div className="w-full space-y-4">
                    
                    {/* Timer Card */}
                    <div className="bg-dark-bg2 rounded-button border border-dark-stroke p-4">
                        <div className="text-center space-y-4">
                            {/* Timer Display */}
                            <div className="relative">
                                {/* Progress Ring */}
                                <svg className="w-full h-48" viewBox="0 0 200 200">
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="85"
                                        stroke="var(--color-stroke)"
                                        strokeWidth="6"
                                        fill="none"
                                    />
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="85"
                                        stroke="var(--color-text1)"
                                        strokeWidth="6"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 85}`}
                                        strokeDashoffset={`${2 * Math.PI * 85 * (1 - progress / 100)}`}
                                        className="transition-all duration-1000"
                                        strokeLinecap="round"
                                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                    />
                                </svg>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-4xl font-bold text-dark-text1">
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="space-y-2">
                                <button
                                    onClick={toggleTimer}
                                    className="w-full py-3 bg-white hover:bg-gray-200 text-black rounded-button font-bold transition-all"
                                    title="Start/Pause (SPACE)"
                                >
                                    {isRunning ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <IoPause className="w-5 h-5" />
                                            <span>Pause</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <IoPlay className="w-5 h-5" />
                                            <span>Start</span>
                                        </div>
                                    )}
                                </button>
                                <button
                                    onClick={resetTimer}
                                    className="w-full py-2 bg-dark-active hover:bg-dark-hover text-dark-text2 hover:text-dark-text1 rounded-button transition-all border border-dark-stroke text-sm"
                                    title="Reset"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <IoRefresh className="w-4 h-4" />
                                        <span>Reset</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Timer Settings */}
                    <div className="bg-dark-bg2 rounded-button border border-dark-stroke p-3">
                        <div className="space-y-2">
                            <span className="text-dark-text2 text-xs">Duration</span>
                            {editingTime ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={tempDuration}
                                        onChange={(e) => setTempDuration(e.target.value)}
                                        onBlur={saveDuration}
                                        className="flex-1 bg-dark-active border border-dark-stroke rounded-button px-2 py-1.5 text-dark-text1 text-center font-bold focus:outline-none focus:border-dark-text1 text-sm"
                                        min="1"
                                        max="120"
                                        autoFocus
                                    />
                                    <span className="text-dark-text1 text-xs">min</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-1">
                                    <button
                                        onClick={() => adjustDuration(-5)}
                                        className="p-1.5 bg-dark-active hover:bg-dark-hover rounded-button text-dark-text1 transition-all border border-dark-stroke"
                                        disabled={duration <= 5}
                                    >
                                        <IoRemove className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={startEditing}
                                        className="flex-1 py-1.5 hover:bg-dark-active rounded-button transition-all border border-dark-stroke"
                                    >
                                        <span className="text-2xl font-bold text-dark-text1">{duration}</span>
                                        <span className="text-dark-text2 text-xs ml-1">min</span>
                                    </button>
                                    <button
                                        onClick={() => adjustDuration(5)}
                                        className="p-1.5 bg-dark-active hover:bg-dark-hover rounded-button text-dark-text1 transition-all border border-dark-stroke"
                                        disabled={duration >= 120}
                                    >
                                        <IoAdd className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Task Card */}
                    <div className="bg-dark-bg2 rounded-button border border-dark-stroke p-3">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 justify-center">
                                <img
                                    src={currentTask?.spaceId?.image || "/icon.png"}
                                    alt="Space"
                                    className="w-8 h-8 rounded-button border border-dark-stroke object-cover"
                                />
                                <span className="px-2 py-0.5 bg-dark-active rounded-button text-xs text-dark-text2 capitalize border border-dark-stroke">
                                    {currentTask?.status?.title || 'No Status'}
                                </span>
                            </div>
                            
                            <h2 className="text-lg font-bold text-dark-text1 leading-tight text-center">{currentTask.title}</h2>
                            
                            {/* Task Meta */}
                            {(currentTask.estimatedDate || currentTask.dueDate) && (
                                <div className="space-y-1">
                                    {currentTask.estimatedDate && (
                                        <div className="flex items-center justify-between px-2 py-1 bg-dark-active rounded-button border border-dark-stroke">
                                            <span className="text-dark-text2 text-xs">Est:</span>
                                            <span className="text-dark-text1 text-xs font-medium">{currentTask.estimatedDate}</span>
                                        </div>
                                    )}
                                    {currentTask.dueDate && (
                                        <div className="flex items-center justify-between px-2 py-1 bg-dark-active rounded-button border border-dark-stroke">
                                            <span className="text-dark-text2 text-xs">Due:</span>
                                            <span className="text-dark-text1 text-xs font-medium">
                                                {new Date(currentTask.dueDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleTaskComplete(currentTask._id)}
                                    className="flex-1 p-2 bg-dark-active hover:bg-dark-hover text-dark-text2 hover:text-dark-text1 rounded-button transition-all border border-dark-stroke"
                                    title="Complete"
                                >
                                    <FaRegSquareCheck className="w-4 h-4 mx-auto" />
                                </button>
                                <button
                                    onClick={() => handleTaskDelete(currentTask._id)}
                                    className="flex-1 p-2 bg-dark-active hover:bg-dark-hover text-dark-text2 hover:text-dark-text1 rounded-button transition-all border border-dark-stroke"
                                    title="Delete"
                                >
                                    <AiOutlineDelete className="w-4 h-4 mx-auto" />
                                </button>
                            </div>
                        </div>

                        {/* Subtasks */}
                        {currentTask.subtasks && currentTask.subtasks.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-dark-stroke">
                                <h3 className="text-dark-text1 text-xs font-semibold mb-2 flex items-center justify-between">
                                    <span>Subtasks</span>
                                    <span className="text-xs px-1.5 py-0.5 bg-dark-active rounded-button text-dark-text2">
                                        {currentTask.subtasks.filter(s => s.isCompleted).length}/{currentTask.subtasks.length}
                                    </span>
                                </h3>
                                <div className="space-y-1.5">
                                    {currentTask.subtasks.map((subtask, index) => (
                                        <div
                                            key={subtask._id || index}
                                            className="flex items-center gap-2 p-2 bg-dark-active rounded-button border border-dark-stroke"
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                                subtask.isCompleted 
                                                    ? 'bg-white border-white' 
                                                    : 'border-dark-stroke'
                                            }`}>
                                                {subtask.isCompleted && <IoCheckmark className="w-3 h-3 text-black" />}
                                            </div>
                                            <span className={`flex-1 text-xs ${
                                                subtask.isCompleted 
                                                    ? 'text-dark-text2 line-through' 
                                                    : 'text-dark-text1'
                                            }`}>
                                                {subtask.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="space-y-2 pb-4">
                        <div className="text-center px-3 py-1 bg-dark-bg2 rounded-button border border-dark-stroke">
                            <span className="text-dark-text1 font-semibold text-sm">{currentTaskIndex + 1}</span>
                            <span className="text-dark-text2 text-xs"> / {incompleteTasks.length}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePreviousTask}
                                disabled={currentTaskIndex === 0}
                                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-button text-xs font-semibold transition-all border border-dark-stroke ${
                                    currentTaskIndex > 0
                                        ? 'bg-dark-bg2 text-dark-text1 hover:bg-dark-active'
                                        : 'bg-dark-bg2 text-dark-text2 opacity-50 cursor-not-allowed'
                                }`}
                            >
                                <IoChevronBack className="w-4 h-4" />
                                <span>Prev</span>
                            </button>

                            <button
                                onClick={handleNextTask}
                                disabled={currentTaskIndex === incompleteTasks.length - 1}
                                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-button text-xs font-semibold transition-all border border-dark-stroke ${
                                    currentTaskIndex < incompleteTasks.length - 1
                                        ? 'bg-dark-bg2 text-dark-text1 hover:bg-dark-active'
                                        : 'bg-dark-bg2 text-dark-text2 opacity-50 cursor-not-allowed'
                                }`}
                            >
                                <span>Next</span>
                                <IoChevronForward className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusModePage;
