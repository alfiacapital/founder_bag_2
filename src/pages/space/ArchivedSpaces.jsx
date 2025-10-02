import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/api/axios.jsx";
import { useUserContext } from "@/context/UserProvider.jsx";
import { FiRotateCcw, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import DeleteModal from "@/components/DeleteModal.jsx";

function ArchivedSpaces() {
    const { user } = useUserContext();
    const queryClient = useQueryClient();
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, space: null });

    // Fetch archived spaces
    const { data: archivedSpaces = [], isLoading } = useQuery({
        queryKey: ["archived-spaces"],
        queryFn: async () => {
            const res = await axiosClient.get(`/space/inactive/list`);
            return res.data || [];
        },
        enabled: !!user?._id,
    });

    // Restore space
    const handleRestore = async (space) => {
        try {
            await axiosClient.put(`/space/${space._id}/restore`);
            await queryClient.invalidateQueries("archived-spaces");
            await queryClient.invalidateQueries("spaces");
            toast.success(`"${space.name}" restored successfully!`);
        } catch (error) {
            console.error("Error restoring space:", error);
            toast.error("Failed to restore space");
        }
    };

    // Delete permanently
    const handleDeletePermanently = async () => {
        if (!deleteModal.space) return;
        
        try {
            await axiosClient.delete(`/space/${deleteModal.space._id}/hard`);
            await queryClient.invalidateQueries("archived-spaces");
            toast.success(`"${deleteModal.space.name}" deleted permanently!`);
        } catch (error) {
            console.error("Error deleting space:", error);
            toast.error("Failed to delete space permanently");
        } finally {
            setDeleteModal({ isOpen: false, space: null });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-dark-text2">Loading archived spaces...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg2 p-6 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Archived Spaces</h1>
                <p className="text-dark-text2">
                    Manage your archived spaces. Restore them or delete permanently.
                </p>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">
                {archivedSpaces.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-dark-active rounded-full flex items-center justify-center mb-4">
                            <FiTrash2 className="text-4xl text-dark-text2" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">No Archived Spaces</h2>
                        <p className="text-dark-text2 max-w-md">
                            You haven't archived any spaces yet. Archived spaces will appear here.
                        </p>
                    </div>
                ) : (
                    // Archived Spaces Grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {archivedSpaces.map((space) => {
                            const tasks = Array.isArray(space.tasks) ? space.tasks : [];
                            const tasksCount = space.tasksCount || tasks.length;

                            return (
                                <div
                                    key={space._id}
                                    className="group bg-dark-bg border border-dark-stroke rounded-2xl p-6 hover:border-[#444444] transition-all duration-300 flex flex-col h-[280px] relative"
                                >

                                    {/* Space Info */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            src={space?.image || "/icon.png"}
                                            className="h-12 w-12 rounded-xl border border-[#444444] object-cover"
                                            alt={space?.name}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-white truncate">
                                                {space?.name}
                                            </h3>
                                            <p className="text-sm text-dark-text2">
                                                {tasksCount} {tasksCount === 1 ? 'task' : 'tasks'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tasks Preview */}
                                    <div className="flex-1 overflow-hidden mb-4">
                                        {tasks.length > 0 ? (
                                            <div className="space-y-2">
                                                {tasks.slice(0, 2).map((task, idx) => (
                                                    <div
                                                        key={task._id || idx}
                                                        className="flex items-center gap-2 px-3 py-2 bg-dark-bg2 border border-dark-stroke rounded-lg text-sm text-dark-text2 truncate"
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-dark-text2 flex-shrink-0"></div>
                                                        <span className="truncate">{task?.title || "Untitled"}</span>
                                                    </div>
                                                ))}
                                                {tasks.length > 2 && (
                                                    <p className="text-xs text-dark-text2 text-center">
                                                        +{tasks.length - 2} more
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-dark-text2 text-center py-4">
                                                No tasks
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-auto">
                                        <button
                                            onClick={() => handleRestore(space)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-dark-stroke hover:border-dark-stroke hover:bg-dark-hover cursor-pointer text-white rounded-lg transition-colors font-medium"
                                        >
                                            <FiRotateCcw size={16} />
                                            <span>Restore</span>
                                        </button>
                                        <button
                                            title='Delete Permently'
                                            onClick={() => setDeleteModal({ isOpen: true, space })}
                                            className="flex items-center justify-center px-4 py-2 bg-red-600/10 hover:bg-red-600/20 cursor-pointer text-red-500 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-colors"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                title="Delete Space Permanently"
                message={`Are you sure you want to permanently delete "${deleteModal.space?.name}"? This action cannot be undone and all tasks will be lost.`}
                onClick={handleDeletePermanently}
                onClose={() => setDeleteModal({ isOpen: false, space: null })}
            />
        </div>
    );
}

export default ArchivedSpaces;
