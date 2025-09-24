import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/UserProvider.jsx";
import Menu from "@/components/Menu.jsx";
import { FaEllipsisVertical } from "react-icons/fa6";
import { getUserImage } from "@/utils/getUserImage.jsx";
import { axiosClient } from "@/api/axios.jsx";
import {PiDotsSixVertical} from "react-icons/pi";

export default function ListView({ notes, setNotes, setDeleteModal, setShareModal, setManageUsersModal }) {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

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
                                        <div className="h-1 bg-[#444444] rounded-full my-1 transition-all"></div>
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
                                        className="text-white font-medium"
                                    >
                                      {note.title}
                                    </span>
                                </td>

                                {/* Shared users */}
                                <td className="px-4 py-2">
                                    <div className="flex items-center -space-x-3">
                                        <img
                                            className="border-2 border-[#444444] bg-dark-bg rounded-full h-7 w-7 object-cover"
                                            src={getUserImage(user?.image)}
                                            alt={user?.full_name || "Owner"}
                                        />
                                        {note.sharedWith &&
                                            note.sharedWith.slice(0, 4).map((sharedUser, key) => (
                                                <img
                                                    key={key}
                                                    className="border-2 border-[#444444] bg-dark-bg rounded-full h-7 w-7 object-cover"
                                                    src={getUserImage(sharedUser.image)}
                                                    alt={sharedUser.full_name}
                                                />
                                            ))}
                                        {note.sharedWith && note.sharedWith.length > 4 && (
                                            <span className="flex items-center justify-center bg-dark-bg2 text-xs text-white font-semibold border-2 border-[#444444] rounded-full h-8 w-8 pt-1">
                                              +{note.sharedWith.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-2">
                                    <Menu
                                        button={
                                            <button className="p-1.5 rounded-button border border-dark-stroke hover:bg-dark-hover cursor-pointer text-dark-text2 hover:text-white">
                                                <FaEllipsisVertical />
                                            </button>
                                        }
                                        items={[
                                            { label: "Share", onClick: () => setShareModal({ isOpen: true, note }) },
                                            { label: "Manage", onClick: () => setManageUsersModal({ isOpen: true, note }) },
                                            { label: "Delete", onClick: () => setDeleteModal({ isOpen: true, note }) },
                                        ]}
                                    />
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}

                    {/* Placeholder at the end if dragging below last item */}
                    {dragOverIndex === notes.length && draggingIndex !== notes.length && (
                        <tr>
                            <td colSpan={3}>
                                <div className="h-1 bg-[#444444] rounded-full my-1 transition-all"></div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
