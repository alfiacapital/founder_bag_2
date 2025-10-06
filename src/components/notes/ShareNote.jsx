import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal.jsx";
import { axiosClient } from "@/api/axios.jsx";
import { FaUserPlus, FaCopy } from "react-icons/fa";
import { getUserImage } from "@/utils/getUserImage.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function ShareNote({ isOpen, onClose, noteId }) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const noteLink = `https://comming.soon/note/${noteId}`; // link to copy

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
            toast.success("Note shared successfully");
            onClose();
        } catch (err) {
            toast.error(err.message || "Failed to share note");
            console.error(err);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(noteLink);
        toast.success("Link copied to clipboard!");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <h2 className="text-xl font-bold text-dark-text1 mb-1">Share Note</h2>
            <span className="text-sm font-bold text-dark-text2 mb-2 block">
        Or copy link if user does not exist
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
                    <FaCopy /> Copy
                </button>
            </div>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by email or full name..."
                className="w-full px-4 py-2 rounded-lg bg-dark-bg border border-dark-stroke text-dark-text1 placeholder-dark-text2 focus:outline-none focus:ring-1 focus:ring-primary mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Results */}
            <div className="max-h-64 overflow-y-auto space-y-2">
                {loading ? (
                    <p className="text-dark-text2 text-sm">Searching...</p>
                ) : results.length > 0 ? (
                    results.map((user) => (
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
                                <FaUserPlus /> Share
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-dark-text2 text-sm">
                        {search.trim() ? "No users found" : "Start typing to search users..."}
                    </p>
                )}
            </div>
        </Modal>
    );
}

export default ShareNote;
