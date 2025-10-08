import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "@/components/Menu.jsx";
import { FaEllipsisVertical } from "react-icons/fa6";
import { getUserImage } from "@/utils/getUserImage.jsx";
import { axiosClient } from "@/api/axios.jsx";
import {PiDotsSixVertical} from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useUserContext } from "@/context/UserProvider";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DeleteModal from "@/components/DeleteModal.jsx";

export default function ListView({ notes, setNotes, setDeleteModal, setShareModal, setManageUsersModal }) {
    const { t } = useTranslation("global");
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [leaveModal, setLeaveModal] = useState({ isOpen: false, note: null });
    const {user} = useUserContext();
    const handleDragStart = (index) => {
        setDraggingIndex(index);
    };

    const handleDragEnter = (index) => {
        if (index !== draggingIndex) {
            setDragOverIndex(index);
        }
    };

    const handleDragEnd = async () => {
        if (draggingIndex === null || dragOverIndex === null) return;

        const newNotes = [...notes];
        const [movedNote] = newNotes.splice(draggingIndex, 1);
        newNotes.splice(dragOverIndex, 0, movedNote);

        setNotes(newNotes);

        setDraggingIndex(null);
        setDragOverIndex(null);

        const orderedNotes = newNotes.map((note, idx) => ({ _id: note._id, order: idx }));
        try {
            await axiosClient.post("/notes/reorder", { notes: orderedNotes });
        } catch (err) {
            console.error("Failed to save note order:", err);
        }
    };

    const handleLeaveNote = async () => {
        if (!leaveModal.note) return;

        try {
            await axiosClient.post(`/notes/${leaveModal.note._id}/leave`);
            
            // Invalidate queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            queryClient.invalidateQueries({ queryKey: ["shared-with-me-notes"] });
            queryClient.invalidateQueries({ queryKey: ["recently-notes"] });
            queryClient.invalidateQueries({ queryKey: ["shared-notes"] });
            
            toast.success(t("left-note-successfully") || "You have successfully left the note");
            setLeaveModal({ isOpen: false, note: null });
        } catch (error) {
            console.error("Error leaving note:", error);
            toast.error(error.response?.data?.message || t("failed-to-leave-note") || "Failed to leave note");
        }
    };

    return (
        <div className="">
            <div className="">
                <table className="min-w-full">
                    <tbody>
                    {notes.map((note, idx) => (
                        <React.Fragment key={note._id}>
                            {/* Placeholder line above the item if it's the drop target */}
                            {dragOverIndex === idx && draggingIndex !== idx && (
                                <tr>
                                    <td colSpan={3}>
                                        <div className="h-1 bg-dark-stroke rounded-full my-1 transition-all"></div>
                                    </td>
                                </tr>
                            )}

                            <tr
                                draggable
                                onDragStart={() => handleDragStart(idx)}
                                onDragEnter={() => handleDragEnter(idx)}
                                onDragEnd={handleDragEnd}
                                className={`transition cursor-pointer ${
                                    draggingIndex === idx ? "opacity-50 bg-dark-hover" : ""
                                } hover:bg-dark-hover`}
                            >
                                {/* Drag handle + Title */}
                                <td className="px-4 py-2 flex items-center gap-3">
                                    <PiDotsSixVertical className="text-dark-text2 cursor-move h-6 w-6" />
                                    <span
                                        onClick={() => navigate(`/note/${note._id}`)}
                                        className="text-dark-text1 font-medium"
                                    >
                                      {note.title}
                                    </span>
                                </td>

                                {/* Shared users */}
                                <td className="px-4 py-2">
                                    <div className="flex items-center -space-x-3">
                                        {/* Note owner image */}
                                        <img
                                            className="border-2 border-dark-stroke bg-dark-bg rounded-full h-7 w-7 object-cover"
                                            src={getUserImage(note.userId?.image)}
                                            alt={note.userId?.full_name || "Owner"}
                                        />
                                        {/* Shared users images */}
                                        {note.sharedWith &&
                                            note.sharedWith.slice(0, 4).map((sharedUser, key) => (
                                                <img
                                                    key={key}
                                                    className="border-2 border-dark-stroke bg-dark-bg rounded-full h-7 w-7 object-cover"
                                                    src={getUserImage(sharedUser.image)}
                                                    alt={sharedUser.full_name}
                                                />
                                            ))}
                                        {note.sharedWith && note.sharedWith.length > 4 && (
                                            <span className="flex items-center justify-center bg-dark-bg2 text-xs text-dark-text1 font-semibold border-2 border-dark-stroke rounded-full h-8 w-8 pt-1">
                                              +{note.sharedWith.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-2">
                                    {user._id === note?.userId?._id ? (
                                        <Menu
                                            button={
                                                <button className="p-1.5 rounded-button border border-dark-stroke hover:bg-dark-hover cursor-pointer text-dark-text2 hover:text-dark-text1">
                                                    <FaEllipsisVertical />
                                                </button>
                                            }
                                            items={[
                                                { label: t('share'), onClick: () => setShareModal({ isOpen: true, note }) },
                                                { label: t('manage'), onClick: () => setManageUsersModal({ isOpen: true, note }) },
                                                { label: t('trash'), onClick: () => setDeleteModal({ isOpen: true, note }) },
                                            ]}
                                        />
                                    ) : (
                                        <Menu
                                            button={
                                                <button className="p-1.5 rounded-button border border-dark-stroke hover:bg-dark-hover cursor-pointer text-dark-text2 hover:text-dark-text1">
                                                    <FaEllipsisVertical />
                                                </button>
                                            }
                                            items={[
                                                { label: t("leave-note") || "Leave Note", onClick: () => setLeaveModal({ isOpen: true, note }) },
                                            ]}
                                        />
                                    )}
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}

                    {/* Placeholder at the end if dragging below last item */}
                    {dragOverIndex === notes.length && draggingIndex !== notes.length && (
                        <tr>
                            <td colSpan={3}>
                                <div className="h-1 bg-dark-stroke rounded-full my-1 transition-all"></div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Leave Note Modal */}
            <DeleteModal
                isOpen={leaveModal.isOpen}
                title={t('leave-note')}
                message={`${t('are-you-sure-leave-note-message') || 'Are you sure you want to leave'} "${leaveModal.note?.title}"?`}
                onClick={handleLeaveNote}
                onClose={() => setLeaveModal({ isOpen: false, note: null })}
                buttonMessage={t('leave-note')}
            />
        </div>
    );
}
