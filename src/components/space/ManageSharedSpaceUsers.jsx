import React from "react";
import Modal from "../Modal.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../api/axios.jsx";
import { FaTrash } from "react-icons/fa";
import { getUserImage } from "../../utils/getUserImage.jsx";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function ManageSharedSpaceUsers({ isOpen, onClose, spaceId, sharedUsers = [] }) {
    const { t } = useTranslation("global");
    const queryClient = useQueryClient();

    const handleRemoveUser = async (userId) => {
        try {
            await axiosClient.post(`/space/${spaceId}/remove-user`, { userId });
            await queryClient.invalidateQueries(["sharedSpaceUsers", spaceId]);
            await queryClient.invalidateQueries("spaces");
            toast.success(t('user-removed-successfully') || "User removed successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Failed to remove user!");
        } finally {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <h2 className="text-xl font-bold text-dark-text1 mb-4">{t('manage-shared-users') || 'Manage Shared Users'}</h2>

            {sharedUsers.length === 0 ? (
                <p className="text-dark-text2">{t('no-users-shared') || 'No users have been invited to this space.'}</p>
            ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {sharedUsers.map((user, key) => (
                        <div
                            key={key}
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
                                    <p className="text-dark-text2 text-sm truncate max-w-50">{user.email}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleRemoveUser(user._id)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-opacity-80 transition cursor-pointer"
                            >
                                <FaTrash /> {t('remove') || 'Remove'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
}

export default ManageSharedSpaceUsers;
