import React, {useEffect, useRef, useState, useMemo} from "react";
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
import {IoShareSocialOutline} from "react-icons/io5";
import {RiUserSharedLine} from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { useUserContext } from "@/context/UserProvider.jsx";

function Notes() {
    const { t } = useTranslation("global");
    const { user } = useUserContext();
    const [page, setPage] = useState(1);
    const [shareModal, setShareModal] = useState({ isOpen: false, note: null })
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, note: null });
    const [manageUsersModal, setManageUsersModal] = useState({ isOpen: false, note: null });
    const [localNotes, setLocalNotes] = useState([]);
    const [notesView, setNotesView] = useState("all"); // Changed from "list" to "all"
    
    // Fetch all notes
    const { data, isLoading } = useQuery({
        queryKey: ["notes", page],
        queryFn: async () => {
            const res = await axiosClient.get(`/notes/by-order?page=${page}&getSharedNotes=true`);
            return res.data;
        },
        keepPreviousData: true,
    });

    // Fetch shared with me notes
    const { data: sharedWithMeData, isLoading: isLoadingSharedWithMe } = useQuery({
        queryKey: ["shared-with-me-notes", page],
        queryFn: async () => {
            const res = await axiosClient.get(`/notes/shared-with-user?page=${page}`);
            return res.data;
        },
        keepPreviousData: true,
        enabled: notesView === "shared-with-me",
    });

    useEffect(() => {
        if (data || data?.notes) {
            setLocalNotes(data.notes?.reverse());
        }
    }, [data, data?.notes]);

    // Filter notes based on selected view
    const filteredNotes = useMemo(() => {
        if (notesView === "shared-with-me") {
            return sharedWithMeData?.notes || [];
        } else if (notesView === "shared-by-me") {
            // Filter notes that YOU created AND shared with others
            return (data?.notes || []).filter(note => 
                note.sharedWith && 
                note.sharedWith.length > 0 && 
                note.userId?._id === user?._id  // Only notes YOU own
            );
        } else if (notesView === "recently-edited") {
            return data?.notes || [];
        } else {
            // "all" view
            return data?.notes || [];
        }
    }, [notesView, data?.notes, sharedWithMeData?.notes, user?._id]);

    const notes = filteredNotes;
    // Pagination based on active view
    const pagination = useMemo(() => {
        if (notesView === "shared-with-me") {
            return {
                page: sharedWithMeData?.page || 1,
                totalPages: sharedWithMeData?.pages || 1,
                total: sharedWithMeData?.total || 0,
            };
        } else if (notesView === "shared-by-me") {
            // No pagination for filtered view
            return {
                page: 1,
                totalPages: 1,
                total: notes.length,
            };
        } else {
            return {
                page: data?.page || 1,
                totalPages: data?.pages || 1,
                total: data?.total || 0,
            };
        }
    }, [notesView, data, sharedWithMeData, notes.length]);

    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // Reset page when changing views
    useEffect(() => {
        setPage(1);
    }, [notesView]);

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

    const loading = notesView === "shared-with-me" ? isLoadingSharedWithMe : isLoading;

    if (loading && page === 1) {
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
                    <h1 className="text-2xl font-bold text-dark-text1">{t('my-notes')}</h1>
                    <NotesViewToggle notesView={notesView} setNotesView={setNotesView} />
                </div>


                {notes.length === 0 ? (
                    <p className="text-dark-text2">{t('no-notes-found')}</p>
                ) : (
                    notesView === "all" || notesView === "shared-with-me" || notesView === "shared-by-me" ?
                        <ListView 
                            notes={notesView === "all" ? localNotes : notes} 
                            setNotes={notesView === "all" ? setLocalNotes : () => {}} 
                            setManageUsersModal={setManageUsersModal} 
                            setShareModal={setShareModal} 
                            setDeleteModal={setDeleteModal} 
                        /> :
                        <CardsView notes={notes} setShareModal={setShareModal} setDeleteModal={setDeleteModal} />
                )}
            </div>

            {/* Pagination (always at bottom) */}
            {(notesView === "all" || notesView === "shared-with-me") && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8 py-6 border-t border-dark-stroke">
                    <button
                        disabled={pagination.page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 rounded-default border border-dark-stroke text-dark-text2 hover:bg-dark-hover hover:text-dark-text1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {t('prev')}
                    </button>

                    <span className="text-dark-text2">
                  {t('page')} {pagination.page} {t('of')} {pagination.totalPages}
                </span>

                    <button
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 rounded-default border border-dark-stroke text-dark-text2 hover:bg-dark-hover hover:text-dark-text1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {t('next')}
                    </button>
                </div>
            )}

            <DeleteModal
                isOpen={deleteModal.isOpen}
                title={t('trash-note')}
                message={`${t('are-you-sure-trash-note')} "${deleteModal.note?.title}"? `}
                onClick={confirmDeleteNote}
                onClose={() => setDeleteModal({ isOpen: false, note: null })}
                buttonMessage={t('trash')}
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
    const { t } = useTranslation("global");
    const allRef = useRef(null);
    const recentRef = useRef(null);
    const sharedWithMeRef = useRef(null);
    const sharedByMeRef = useRef(null);
    const [bgStyle, setBgStyle] = useState({ width: 0, left: 0 });

    useEffect(() => {
        let activeRef = null;
        switch (notesView) {
            case "all":
                activeRef = allRef.current;
                break;
            case "recently-edited":
                activeRef = recentRef.current;
                break;
            case "shared-with-me":
                activeRef = sharedWithMeRef.current;
                break;
            case "shared-by-me":
                activeRef = sharedByMeRef.current;
                break;
            default:
                activeRef = allRef.current;
        }

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
        <div className="relative flex items-center p-1 rounded-button overflow-hidden w-fit gap-1">
            {/* Sliding background */}
            <div
                className="absolute top-0 bottom-0 bg-dark-active rounded-full border border-dark-stroke transition-all duration-300 ease-in-out"
                style={{
                    width: bgStyle.width,
                    left: bgStyle.left,
                }}
            />

            {/* Buttons */}
            <button
                ref={allRef}
                onClick={() => setNotesView("all")}
                className={`relative flex items-center gap-2 px-4 py-1.5 pt-2 cursor-pointer text-sm font-medium z-10 transition-colors duration-200 whitespace-nowrap ${
                    notesView === "all" ? "text-dark-text1" : "text-dark-text2 hover:text-dark-text1"
                }`}
            >
                <PiListBulletsLight className="h-5 w-5 pb-1" />
                {t('all')}
            </button>

            <button
                ref={sharedWithMeRef}
                onClick={() => setNotesView("shared-with-me")}
                className={`relative flex items-center gap-2 px-4 py-1.5 pt-2 cursor-pointer text-sm font-medium z-10 transition-colors duration-200 whitespace-nowrap ${
                    notesView === "shared-with-me" ? "text-dark-text1" : "text-dark-text2 hover:text-dark-text1"
                }`}
            >
                <RiUserSharedLine className="h-5 w-5 pb-1" />
                {t('shared-with-me')}
            </button>

            <button
                ref={sharedByMeRef}
                onClick={() => setNotesView("shared-by-me")}
                className={`relative flex items-center gap-2 px-4 py-1.5 pt-2 cursor-pointer text-sm font-medium z-10 transition-colors duration-200 whitespace-nowrap ${
                    notesView === "shared-by-me" ? "text-dark-text1" : "text-dark-text2 hover:text-dark-text1"
                }`}
            >
                <IoShareSocialOutline className="h-5 w-5 pb-1" />
                {t('shared-by-me')}
            </button>
            <button
                ref={recentRef}
                onClick={() => setNotesView("recently-edited")}
                className={`relative flex items-center gap-2 px-4 py-1.5 pt-2 cursor-pointer text-sm font-medium z-10 transition-colors duration-200 whitespace-nowrap ${
                    notesView === "recently-edited" ? "text-dark-text1" : "text-dark-text2 hover:text-dark-text1"
                }`}
            >
                <RxDashboard className="h-5 w-5 pb-1" />
                {t('recently-edited')}
            </button>
        </div>
    );
}
