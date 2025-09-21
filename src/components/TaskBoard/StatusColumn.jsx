import React from 'react';
import { FiPlus } from "react-icons/fi";
import { MdDone } from "react-icons/md";
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';

const StatusColumn = ({
    status,
    tasksByStatus,
    draggedTask,
    draggedOverStatus,
    creatingTaskFor,
    setCreatingTaskFor,
    newTask,
    setNewTask,
    createCardRef,
    editingTask,
    editingField,
    editValue,
    setEditValue,
    currentEditValueRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragStart,
    handleTaskComplete,
    handleTaskDelete,
    handleTaskCopy,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
    handleEditKeyDown,
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
    return (
        <div
            key={status._id}
            className={`rounded-default border border-dashed border-dark-stroke p-4 min-h-[500px] transition-all duration-300 bg-dark-bg2`}
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
                    className="text-dark-text2 hover:text-white cursor-pointer pb-1"
                >
                    <FiPlus className="w-5 h-5" />
                </button>
            </div>

            {/* Create task form */}
            {creatingTaskFor === status._id && (
                <TaskForm
                    createCardRef={createCardRef}
                    newTask={newTask}
                    setNewTask={setNewTask}
                />
            )}

            {/* Tasks */}
            <div className="space-y-3">
                {tasksByStatus[status._id]?.map((task, key) => (
                    <TaskCard
                        key={task._id}
                        task={task}
                        index={key}
                        draggedTask={draggedTask}
                        editingTask={editingTask}
                        editingField={editingField}
                        editValue={editValue}
                        setEditValue={setEditValue}
                        currentEditValueRef={currentEditValueRef}
                        handleDragStart={handleDragStart}
                        handleTaskComplete={handleTaskComplete}
                        handleTaskDelete={handleTaskDelete}
                        handleTaskCopy={handleTaskCopy}
                        handleEditStart={handleEditStart}
                        handleEditSave={handleEditSave}
                        handleEditCancel={handleEditCancel}
                        handleEditKeyDown={handleEditKeyDown}
                        visibleSubtasks={visibleSubtasks}
                        toggleSubtasks={toggleSubtasks}
                        addingSubtaskFor={addingSubtaskFor}
                        newSubtaskTitle={newSubtaskTitle}
                        setNewSubtaskTitle={setNewSubtaskTitle}
                        setAddingSubtaskFor={setAddingSubtaskFor}
                        handleAddSubtask={handleAddSubtask}
                        editingSubtaskId={editingSubtaskId}
                        editSubtaskValue={editSubtaskValue}
                        setEditingSubtaskId={setEditingSubtaskId}
                        setEditSubtaskValue={setEditSubtaskValue}
                    />
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
    );
};

export default StatusColumn;
