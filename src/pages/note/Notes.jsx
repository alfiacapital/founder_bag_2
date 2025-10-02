import React, {useEffect, useRef, useState} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/api/axios.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteModal from "@/components/DeleteModal.jsx";
import ShareNote from "@/components/notes/ShareNote.jsx";
import ManageSharedUsers from "@/components/notes/ManageSharedUsers.jsx";
import CardsView from "@/components/notes/CardsView.jsx";
import ListView from "@/components/notes/ListView.jsx";
import {PiListBulletsLight} from "react-icons/pi";
import {RxDashboard} from "react-icons/rx";

function Notes() {
    const [page, setPage] = useState(1);
    const [shareModal, setShareModal] = useState({ isOpen: false, note: null })
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, note: null });
    const [manageUsersModal, setManageUsersModal] = useState({ isOpen: false, note: null });
    const [localNotes, setLocalNotes] = useState([]);
    const { data, isLoading } = useQuery({
        queryKey: ["notes", page],
        queryFn: async () => {
            const res = await axiosClient.get(`/notes/by-order?page=${page}`);
            return res.data;
        },
        keepPreviousData: true,
    });
    useEffect(() => {
        if (data || data?.notes) {
            setLocalNotes(data.notes);
        }
    }, [data, data?.notes]);

    const [notesView, setNotesView] = useState("list")
    const notes = data?.notes || [];
    const pagination = {
        page: data?.page || 1,
        totalPages: data?.pages || 1,
        total: data?.total || 0,
    };

    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const confirmDeleteNote = () => {
        if (deleteModal.note) {
            const note = deleteModal.note;
            const isActive = location.pathname === `/note/${note._id}`;

            axiosClient
                .delete(`/notes/${note._id}`)
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ["notes"] });
                    queryClient.invalidateQueries({ queryKey: ["notes-trash-counts"] });
                    queryClient.invalidateQueries({ queryKey: ["trashed-notes"] });
                    if (isActive) {
                        navigate("/");
                    }
                })
                .catch((error) => {
                    console.error("Error deleting note:", error);
                });
        }
        setDeleteModal({ isOpen: false, note: null });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-14rem)]">
            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">My Notes</h1>
                    <NotesViewToggle notesView={notesView} setNotesView={setNotesView} />
                </div>


                {notes.length === 0 ? (
                    <p className="text-dark-text2">No notes found.</p>
                ) : (
                    notesView === "list" ?
                        <ListView notes={localNotes} setNotes={setLocalNotes} setManageUsersModal={setManageUsersModal} setShareModal={setShareModal} setDeleteModal={setDeleteModal} /> :
                        <CardsView notes={notes}  setShareModal={setShareModal} setDeleteModal={setDeleteModal} />
                )}
            </div>

            {/* Pagination (always at bottom) */}
            {notesView === "list" && (
                <div className="flex justify-center items-center gap-3 mt-8 py-6 border-t border-dark-stroke">
                    <button
                        disabled={pagination.page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 rounded-default border border-dark-stroke text-dark-text2 hover:bg-dark-hover hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Prev
                    </button>

                    <span className="text-dark-text2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                    <button
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 rounded-default border border-dark-stroke text-dark-text2 hover:bg-dark-hover hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}

            <DeleteModal
                isOpen={deleteModal.isOpen}
                title="Trash Note"
                message={`Are you sure you want to trash "${deleteModal.note?.title}"? `}
                onClick={confirmDeleteNote}
                onClose={() => setDeleteModal({ isOpen: false, note: null })}
                buttonMessage="Trash"
            />

            <ShareNote
                isOpen={shareModal?.isOpen}
                onClose={() => setShareModal({ isOpen: false, note: null })}
                noteId={shareModal?.note?._id}
            />

            <ManageSharedUsers
                isOpen={manageUsersModal?.isOpen}
                onClose={() => setManageUsersModal({ isOpen: false, note: null })}
                noteId={manageUsersModal?.note?._id}
            />
        </div>
    );
}

export default Notes;


function NotesViewToggle({ notesView, setNotesView }) {
    const listRef = useRef(null);
    const cardsRef = useRef(null);
    const [bgStyle, setBgStyle] = useState({ width: 0, left: 0 });

    useEffect(() => {
        const activeRef = notesView === "list" ? listRef.current : cardsRef.current;
        if (activeRef) {
            const rect = activeRef.getBoundingClientRect();
            const parentRect = activeRef.parentElement.getBoundingClientRect();
            setBgStyle({
                width: rect.width,
                left: rect.left - parentRect.left,
            });
        }
    }, [notesView]);

    return (
        <div className="relative flex items-center p-1 rounded-button overflow-hidden  w-fit min-w-[260px]">
            {/* Sliding background */}
            <div
                className="absolute top-0 bottom-0 bg-[#181818] rounded-full border border-[#444444] transition-all duration-300 ease-in-out"
                style={{
                    width: bgStyle.width,
                    left: bgStyle.left,
                }}
            />

            {/* Buttons */}
            <button
                ref={listRef}
                onClick={() => setNotesView("list")}
                className={`relative flex items-center gap-2 px-4 py-1.5 pt-2 cursor-pointer text-sm font-medium z-10 transition-colors duration-200 ${
                    notesView === "list" ? "text-white" : "text-dark-text2 hover:text-white"
                }`}
            >
                <PiListBulletsLight className="h-5 w-5 pb-1" />
                All
            </button>

            <button
                ref={cardsRef}
                onClick={() => setNotesView("cards")}
                className={`relative flex items-center gap-2 px-4 py-1.5 pt-2 cursor-pointer text-sm font-medium z-10 transition-colors duration-200 ${
                    notesView === "cards" ? "text-white" : "text-dark-text2 hover:text-white"
                }`}
            >
                <RxDashboard className="h-5 w-5 pb-1" />
                Recently Edited
            </button>
        </div>
    );
}
