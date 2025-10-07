import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/api/axios.jsx";
import { FiRotateCcw, FiTrash2 } from "react-icons/fi";
import { SiGoogledocs } from "react-icons/si";
import { toast } from "react-toastify";
import DeleteModal from "@/components/DeleteModal.jsx";
import { useTranslation } from "react-i18next";

function TrashedNotes() {
    const { t } = useTranslation("global");
    const queryClient = useQueryClient();
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, note: null });

    // Fetch trashed notes
    const { data: trashedNotes = [], isLoading } = useQuery({
        queryKey: ["trashed-notes"],
        queryFn: async () => {
            const res = await axiosClient.get('/notes/inactive');
            return res.data.notes || [];
        },
    });

    // Restore note
    const handleRestore = async (note) => {
        try {
            await axiosClient.put(`/notes/${note._id}/restore`);
            await queryClient.invalidateQueries("trashed-notes");
            await queryClient.invalidateQueries("notes");
            toast.success(`"${note.title}" ${t('restored-successfully')}`);
        } catch (error) {
            console.error("Error restoring note:", error);
            toast.error(t('failed-to-restore-note'));
        }
    };

    // Delete permanently
    const handleDeletePermanently = async () => {
        if (!deleteModal.note) return;
        
        try {
            await axiosClient.delete(`/notes/${deleteModal.note._id}/hard`);
            await queryClient.invalidateQueries("trashed-notes");
            toast.success(`"${deleteModal.note.title}" ${t('deleted-permanently')}`);
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error(t('failed-to-delete-permanently'));
        } finally {
            setDeleteModal({ isOpen: false, note: null });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-dark-text2">{t('loading-trashed-notes')}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            {/* Header */}
            <div className=" mb-8">
                <h1 className="text-3xl font-bold text-dark-text1 mb-2">{t('trashed-notes')}</h1>
                <p className="text-dark-text2">
                    {t('manage-trashed-notes')}
                </p>
            </div>

            {/* Content */}
            <div className="">
                {trashedNotes.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-dark-active rounded-full flex items-center justify-center mb-4">
                            <FiTrash2 className="text-4xl text-dark-text2" />
                        </div>
                        <h2 className="text-xl font-semibold text-dark-text1 mb-2">{t('no-trashed-notes')}</h2>
                        <p className="text-dark-text2 max-w-md">
                            {t('no-trashed-notes-desc')}
                        </p>
                    </div>
                ) : (
                    // Trashed Notes List
                    <div className="space-y-3">
                        {trashedNotes.map((note) => (
                            <div
                                key={note._id}
                                className="group bg-dark-bg border border-dark-stroke rounded-xl p-4 hover:border-dark-stroke-hover transition-all duration-300 flex items-center gap-4"
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0 w-10 h-10 bg-dark-active rounded-lg flex items-center justify-center border border-dark-stroke">
                                    <SiGoogledocs className="text-dark-text2 text-lg" />
                                </div>

                                {/* Note Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-dark-text1 truncate mb-1">
                                        {note.title || t('untitled-note')}
                                    </h3>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleRestore(note)}
                                        className="flex items-center gap-2 px-4 py-2 border border-dark-stroke hover:border-dark-stroke hover:bg-dark-hover text-dark-text1 rounded-lg transition-colors"
                                        title={t('restore-note')}
                                    >
                                        <FiRotateCcw size={16} />
                                        <span className="hidden sm:inline">{t('restore')}</span>
                                    </button>
                                    <button
                                        onClick={() => setDeleteModal({ isOpen: true, note })}
                                        className="flex items-center justify-center p-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-colors"
                                        title={t('delete-permanently')}
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                title={t('delete-note-permanently')}
                message={`${t('are-you-sure-delete-permanently')} "${deleteModal.note?.title}"? ${t('cannot-be-undone')}`}
                onClick={handleDeletePermanently}
                onClose={() => setDeleteModal({ isOpen: false, note: null })}
            />
        </div>
    );
}

export default TrashedNotes;
