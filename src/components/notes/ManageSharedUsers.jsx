import React from "react";
import Modal from "@/components/Modal.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/api/axios.jsx";
import { FaTrash } from "react-icons/fa";
import {getUserImage} from "@/utils/getUserImage.jsx";

function ManageSharedUsers({ isOpen, onClose, noteId }) {
    const queryClient = useQueryClient();

    const { data: sharedUsers = [], isLoading } = useQuery({
        queryKey: ["sharedUsers", noteId],
        queryFn: async () => {
            const res = await axiosClient.get(`/notes/${noteId}/shared-users`);
            return res.data;
        },
        enabled: isOpen, // fetch only when modal is open
    });

    const handleRemoveUser = async (userId) => {
        try {
            await axiosClient.post(`/notes/${noteId}/unshare`, { userIds: [userId] });
            await queryClient.invalidateQueries(["sharedUsers", noteId]);
            await queryClient.invalidateQueries("notes");
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <h2 className="text-xl font-bold text-dark-text1 mb-4">Manage Shared Users</h2>

            {isLoading ? (
                <p className="text-dark-text2">Loading...</p>
            ) : sharedUsers.length === 0 ? (
                <p className="text-dark-text2">No users shared with this note.</p>
            ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {sharedUsers.map((user, key) => (
                        <div
                            key={key}
                            className="flex items-center justify-between  p-3 rounded-lg border border-dark-stroke bg-dark-bg hover:bg-dark-hover transition"
                        >

                            <div className="flex items-center gap-3">
                                <img
                                    src={getUserImage(user.image)}
                                    alt={user.full_name}
                                    className="w-10 h-10 rounded-full object-cover border border-dark-stroke"
                                />
                                <div>
                                    <p className="text-dark-text1 font-medium ">{user.full_name}</p>
                                    <p className="text-dark-text2 text-sm truncate max-w-50">{user.email}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleRemoveUser(user._id)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-opacity-80 transition cursor-pointer"
                            >
                                <FaTrash /> Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
}

export default ManageSharedUsers;
