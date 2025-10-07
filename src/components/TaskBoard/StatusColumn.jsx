import React from 'react';
import { FiPlus } from "react-icons/fi";
import { MdDone } from "react-icons/md";
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import { useTranslation } from 'react-i18next';
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
    setEditSubtaskValue,
    onEnterFocusMode
}) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    return (
        <div
            key={status._id}
            className="h-full min-w-[280px] max-h-[calc(100vh-20vh)] min-h-[600px] sm:min-w-0 flex flex-col rounded-default border border-dashed border-dark-stroke bg-dark-bg2 transition-all duration-300"
            onDragOver={(e) => handleDragOver(e, status._id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status._id)}
        >
            {/* Status Header - Fixed */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b border-dark-stroke flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm md:text-base text-dark-text1 capitalize">{status.title}</h3>
                    </div>
                </div>
                <button
                    onClick={() => setCreatingTaskFor(status._id)}
                    className="text-dark-text2 hover:text-white cursor-pointer pb-1 transition-colors duration-200"
                >
                    <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
                </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
                {/* Create task form */}
                {creatingTaskFor === status._id && (
                    <TaskForm
                        createCardRef={createCardRef}
                        newTask={newTask}
                        setNewTask={setNewTask}
                    />
                )}

                {/* Tasks */}
                <div className="space-y-2 md:space-y-3">
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
                            onEnterFocusMode={onEnterFocusMode}
                        />
                    ))}

                    {/* Empty State */}
                    {(!tasksByStatus[status._id] || tasksByStatus[status._id].length === 0) && (
                        <div className="flex flex-col items-center justify-center text-center space-y-2 md:space-y-3 py-12 md:py-20">
                            <div className="border border-[#444444] p-2 rounded-full">
                                <MdDone className="text-dark-text2 text-sm md:text-md" />
                            </div>
                            <p className="text-dark-text2 font-medium text-xs md:text-sm">
                                {isRTL ? 'لا توجد مهام' : 'ALL CLEAR'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatusColumn;
