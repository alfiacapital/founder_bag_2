import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal.jsx";
import { axiosClient } from "@/api/axios.jsx";
import { FaUserPlus, FaCopy } from "react-icons/fa";
import { getUserImage } from "@/utils/getUserImage.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserProvider";
import { useTranslation } from "react-i18next";

function ShareNote({ isOpen, onClose, noteId }) {
    const { t } = useTranslation("global");
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const noteLink = `https://comming.soon/note/${noteId}`; // link to copy
    const {user} = useUserContext();
    const connectedUser = user
    useEffect(() => {
        const delay = setTimeout(() => {
            if (!search.trim()) {
                setResults([]);
                return;
            }

            const fetchUsers = async () => {
                setLoading(true);
                try {
                    const res = await axiosClient.get(`/notes/users?search=${search}`);
                    setResults(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchUsers();
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const handleShare = async (userId) => {
        try {
            await axiosClient.post(`/notes/${noteId}/share`, {
                userIds: [userId],
            });
            await queryClient.invalidateQueries("notes");
            toast.success(t('note-shared-successfully'));
            onClose();
        } catch (err) {
            toast.error(err.message || t('failed-to-share-note'));
            console.error(err);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(noteLink);
        toast.success(t('link-copied'));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <h2 className="text-xl font-bold text-dark-text1 mb-1">{t('share-note')}</h2>
            <span className="text-sm font-bold text-dark-text2 mb-2 block">
        {t('or-copy-link')}
      </span>

            {/* Copy Link Input */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={noteLink}
                    readOnly
                    className="flex-1 px-4 py-2 rounded-lg bg-dark-bg border border-dark-stroke text-dark-text1 placeholder-dark-text2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-primary rounded-lg text-dark-text1 hover:bg-opacity-80 transition flex items-center gap-2"
                >
                    <FaCopy /> {t('copy')}
                </button>
            </div>

            {/* Search Bar */}
            <input
                type="text"
                placeholder={t('search-by-email-or-name')}
                className="w-full px-4 py-2 rounded-lg bg-dark-bg border border-dark-stroke text-dark-text1 placeholder-dark-text2 focus:outline-none focus:ring-1 focus:ring-primary mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Results */}
            <div className="max-h-64 overflow-y-auto space-y-2">
                {loading ? (
                    <p className="text-dark-text2 text-sm">{t('searching')}</p>
                ) : results.length > 0 ? (
                    results?.filter(user => user._id !== connectedUser._id).map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center justify-between p-3 rounded-lg border border-dark-stroke bg-dark-bg hover:bg-dark-hover transition"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={getUserImage(user.image)}
                                    alt={user.full_name}
                                    className="w-10 h-10 rounded-full object-cover border border-dark-stroke"
                                />
                                <div>
                                    <p className="text-dark-text1 font-medium">{user.full_name}</p>
                                    <p className="text-dark-text2 text-sm">{user.email}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleShare(user._id)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-dark-text2 rounded-button border border-dark-stroke hover:bg-dark-hover hover:border-dark-stroke hover:text-dark-text1 transition cursor-pointer"
                            >
                                <FaUserPlus /> {t('share')}
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-dark-text2 text-sm">
                        {search.trim() ? t('no-users-found') : t('start-typing-to-search')}
                    </p>
                )}
            </div>
        </Modal>
    );
}

export default ShareNote;
