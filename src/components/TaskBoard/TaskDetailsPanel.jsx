import React, { useMemo, useState } from 'react';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { CgCloseR } from 'react-icons/cg';
import { AiOutlineDelete } from 'react-icons/ai';
import { FiPlus } from 'react-icons/fi';
import { IoIosArrowUp } from 'react-icons/io';
import { axiosClient } from '@/api/axios';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Lightweight custom tree row for subtasks (no reuse of existing components)
const TreeRow = ({
    node,
    taskId,
    level,
    editingSubtaskId,
    editSubtaskValue,
    setEditingSubtaskId,
    setEditSubtaskValue,
    addingSubtaskFor,
    setAddingSubtaskFor,
    newSubtaskTitle,
    setNewSubtaskTitle,
    handleAddSubtask
}) => {
    const queryClient = useQueryClient();
    const [expanded, setExpanded] = useState(level < 1);

    const toggleComplete = async (e) => {
        e.stopPropagation();
        try {
            await axiosClient.post(`/tasks/${taskId}/subtasks/${node._id}/complete`);
            await queryClient.invalidateQueries('tasks');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update subtask');
        }
    };

    const saveTitle = async () => {
        try {
            await axiosClient.put(`/tasks/${taskId}/subtasks/${node._id}`, { title: editSubtaskValue });
            await queryClient.invalidateQueries('tasks');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save subtask');
        }
        setEditingSubtaskId(null);
    };

    const remove = async (e) => {
        e.stopPropagation();
        try {
            await axiosClient.delete(`/tasks/${taskId}/subtasks/${node._id}`);
            await queryClient.invalidateQueries('tasks');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete subtask');
        }
    };

    return (
        <div className="mb-1">
            <div
                className="flex items-start gap-2 rounded-md bg-dark-bg px-2 py-1.5 border border-dark-stroke hover:border-dark-stroke-hover transition-colors"
                style={{ marginInlineStart: `${level * 16}px` }}
            >
                <button
                    title={node.status === 'completed' ? 'incomplete' : 'complete'}
                    onClick={toggleComplete}
                    className="mt-0.5 text-dark-text2 hover:text-dark-text1"
                >
                    {node.status === 'completed' ? (
                        <CgCloseR className="w-4 h-4" />
                    ) : (
                        <FaRegSquareCheck className="w-4 h-4" />
                    )}
                </button>

                {editingSubtaskId === node._id ? (
                    <input
                        autoFocus
                        value={editSubtaskValue}
                        onChange={(e) => setEditSubtaskValue(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                        className={`flex-1 bg-transparent text-dark-text1 border-b border-dark-stroke focus:outline-none ${
                            node.status === 'completed' ? 'line-through opacity-60' : ''
                        }`}
                        placeholder="subtask title *"
                    />
                ) : (
                    <div
                        className={`flex-1 text-sm pt-0.5 cursor-text ${
                            node.status === 'completed' ? 'line-through opacity-60' : 'text-dark-text2'
                        }`}
                        onClick={() => {
                            setEditingSubtaskId(node._id);
                            setEditSubtaskValue(node.title);
                        }}
                    >
                        {node.title}
                    </div>
                )}

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        title="add child subtask"
                        onClick={(e) => {
                            e.stopPropagation();
                            setAddingSubtaskFor(node._id);
                            setNewSubtaskTitle('');
                        }}
                        className="text-dark-text2 hover:text-dark-text1"
                    >
                        <FiPlus className="w-4 h-4" />
                    </button>
                    {node?.subtasks?.length > 0 && (
                        <button
                            title={expanded ? 'collapse' : 'expand'}
                            onClick={() => setExpanded(!expanded)}
                            className="text-dark-text2 hover:text-dark-text1"
                        >
                            <IoIosArrowUp className={`w-4 h-4 transform transition-transform ${expanded ? '' : 'rotate-180'}`} />
                        </button>
                    )}
                    <button title="delete" onClick={remove} className="text-red-500 hover:text-red-400">
                        <AiOutlineDelete className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {addingSubtaskFor === node._id && (
                <div className="mt-1" style={{ marginInlineStart: `${(level + 1) * 16}px` }}>
                    <input
                        autoFocus
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="subtask title *"
                        className="w-full text-sm border-b border-[#444444] focus:border-white bg-transparent focus:outline-none text-dark-text1"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubtask(taskId, node._id);
                            }
                        }}
                        onBlur={() => handleAddSubtask(taskId, node._id)}
                    />
                </div>
            )}

            {expanded && node?.subtasks?.length > 0 && (
                <div className="mt-1">
                    {node.subtasks
                        .sort((a, b) => a.order - b.order)
                        .map((child) => (
                            <TreeRow
                                key={child._id}
                                node={child}
                                taskId={taskId}
                                level={level + 1}
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
                        ))}
                </div>
            )}
        </div>
    );
};

const TaskDetailsPanel = ({
    task,
    editingSubtaskId,
    editSubtaskValue,
    setEditingSubtaskId,
    setEditSubtaskValue,
    addingSubtaskFor,
    setAddingSubtaskFor,
    newSubtaskTitle,
    setNewSubtaskTitle,
    handleAddSubtask
}) => {
    const completedCount = useMemo(() => (task?.subtasks || []).filter(s => s.status === 'completed').length, [task?.subtasks]);
    const totalCount = task?.subtasks?.length || 0;
    const progress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="flex flex-col gap-3">
            {/* Overview */}
            <div className="rounded-default border border-dark-stroke p-3">
                <div className="flex items-center justify-between">
                    <div className="text-dark-text1 font-semibold">Overview</div>
                    <div className="text-xs text-dark-text2">{progress}% complete</div>
                </div>
                <div className="mt-3 h-2 w-full bg-dark-bg rounded-full overflow-hidden">
                    <div className="h-full bg-dark-active" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-2 text-xs text-dark-text2">
                    {completedCount}/{totalCount} subtasks completed
                </div>
            </div>

            {/* Subtasks (custom, not reusing SubtaskList) */}
            <div className="rounded-default border border-dark-stroke p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-dark-text1 font-semibold">Subtasks</div>
                    {/* <button
                        type="button"
                        onClick={() => {
                            setAddingSubtaskFor(task._id);
                            setNewSubtaskTitle('');
                        }}
                        className="text-dark-text2 hover:text-dark-text1"
                        title="Add Subtask"
                    >
                        <FiPlus className="w-5 h-5" />
                    </button> */}
                </div>

                {addingSubtaskFor === task._id && (
                    <div className="mb-2">
                        <input
                            autoFocus
                            value={newSubtaskTitle}
                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            placeholder="subtask title *"
                            className="w-full text-sm border-b border-[#444444] focus:border-white bg-transparent focus:outline-none text-dark-text1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddSubtask(task._id);
                                }
                            }}
                            onBlur={() => handleAddSubtask(task._id)}
                        />
                    </div>
                )}

                {totalCount === 0 && addingSubtaskFor !== task._id && (
                    <div className="text-sm text-dark-text2">No subtasks yet. Add your first one.</div>
                )}

                {task?.subtasks?.length > 0 && (
                    <div>
                        {task.subtasks
                            .sort((a, b) => a.order - b.order)
                            .map((s) => (
                                <TreeRow
                                    key={s._id}
                                    node={s}
                                    taskId={task._id}
                                    level={0}
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
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetailsPanel;


