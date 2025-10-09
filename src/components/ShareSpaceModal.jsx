import React, { useState, useEffect } from "react";
import Modal from "./Modal.jsx";
import { FiShare2 } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { axiosClient } from "../api/axios.jsx";
import { getUserImage } from "../utils/getUserImage.jsx";
import { useUserContext } from "../context/UserProvider.jsx";

function ShareSpaceModal({ isOpen, space, onShare, onClose }) {
    const { t } = useTranslation("global");
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useUserContext();
    const connectedUser = user;

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

    const handleShare = async (userEmail) => {
        try {
            await onShare(userEmail);
            setSearch(""); // Clear search after success
            setResults([]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="flex flex-col space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="bg-dark-active text-dark-text2 rounded-full p-3">
                        <FiShare2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-dark-text1">
                            {t('share-space') || 'Share Space'}
                        </h2>
                        <p className="text-sm text-dark-text2">
                            {space?.name}
                        </p>
                    </div>
                </div>

                {/* Info Text */}
                <p className="text-sm text-dark-text2">
                    {t('share-space-info') || 'Search for users by email or name to invite them to collaborate on this space.'}
                </p>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder={t('search-by-email-or-name') || 'Search by email or name'}
                    className="w-full px-4 py-2 rounded-button bg-dark-bg border border-dark-stroke text-dark-text1 placeholder-dark-text2 focus:outline-none "
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Results */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                    {loading ? (
                        <p className="text-dark-text2 text-sm">{t('searching') || 'Searching...'}</p>
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
                                    onClick={() => handleShare(user.email)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-dark-text2 rounded-button border border-dark-stroke hover:bg-dark-hover hover:border-dark-stroke hover:text-dark-text1 transition cursor-pointer"
                                >
                                    <FaUserPlus /> {t('invite') || 'Invite'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-dark-text2 text-sm text-center py-8">
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default ShareSpaceModal;

