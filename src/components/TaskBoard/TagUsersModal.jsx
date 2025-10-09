import React, { useState } from "react";
import Modal from "../Modal.jsx";
import { FaUserTag } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { axiosClient } from "../../api/axios.jsx";
import { getUserImage } from "../../utils/getUserImage.jsx";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function TagUsersModal({ isOpen, onClose, task }) {
    const { id } = useParams();
    const { data: spaceData = []} = useQuery({
        queryKey: ["space", id],
        queryFn: async () => await axiosClient.get(`/space-name/${id}`),
        select: res => res.data || [],
        onError: (err) => toast.error(err.message || "Failed to get space")
    });
    const { t } = useTranslation("global");
    const queryClient = useQueryClient();
    const [selectedUsers, setSelectedUsers] = useState(
        task?.userIds ? task.userIds.map(user => user._id) : []
    );
    
    
    // Merge space owner and invited users
    const spaceUsers = React.useMemo(() => {
        const users = [];
        
        // Add space owner
        if (spaceData?.userId) {
            users.push(spaceData.userId);
        }
        
        // Add invited users
        if (spaceData?.invited && Array.isArray(spaceData.invited)) {
            users.push(...spaceData.invited);
        }
        
        return users;
    }, [spaceData]);


    const handleUserToggle = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleSaveTags = async () => {
        try {
            await axiosClient.post(`/tasks/${task._id}/manage-users`, {
                userIds: selectedUsers
            });
            
            await queryClient.invalidateQueries('tasks');
            toast.success(t('users-tagged-successfully') || "Users tagged successfully!");
            onClose();
        } catch (error) {
            console.error('Error tagging users:', error);
            toast.error(error.response?.data?.error || t('failed-to-tag-users') || "Failed to tag users!");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="flex flex-col space-y-4">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="bg-dark-active text-dark-text2 rounded-default p-3">
                        <FaUserTag className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-dark-text1">
                            {t('tag-users') || 'Tag Users'}
                        </h2>
                        <p className="text-sm text-dark-text2">
                            {task?.title}
                        </p>
                    </div>
                </div>

                {/* Info Text */}
                <p className="text-sm text-dark-text2">
                    {t('tag-users-info') || 'Select users to tag in this task. Tagged users will be notified about task updates.'}
                </p>

                {/* Users List */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                    {spaceUsers.length === 0 ? (
                        <p className="text-dark-text2 text-sm text-center py-8">
                            {t('no-users-available') || 'No users available to tag'}
                        </p>
                    ) : (
                        spaceUsers.map((user) => {
                            const isSelected = selectedUsers.includes(user._id);
                            return (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserToggle(user._id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                        isSelected 
                                            ? 'border-dark-stroke bg-dark-active hover:bg-dark-active hover:border-dark-stroke' 
                                            : 'border-dark-stroke bg-dark-bg hover:bg-dark-hover '
                                    }`}
                                >
                                    <img
                                        src={getUserImage(user.image)}
                                        alt={user.full_name}
                                        className="w-10 h-10 rounded-full object-cover border border-dark-stroke"
                                    />
                                    <div className="flex-1">
                                        <p className={`font-medium ${isSelected ? 'text-dark-text1' : 'text-dark-text2'}`}>
                                            {user.full_name}
                                        </p>
                                        <p className="text-dark-text2 text-sm">{user.email}</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                        isSelected 
                                            ? 'border-blue-500 bg-blue-500' 
                                            : 'border-dark-stroke bg-transparent'
                                    }`}>
                                        {isSelected && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 rounded-button  bg-dark-bg hover:bg-dark-hover text-dark-text2 hover:text-dark-text1 transition"
                    >
                        {t('cancel') || 'Cancel'}
                    </button>
                    <button
                        onClick={handleSaveTags}
                        className="flex-1 py-2 rounded-button border border-dark-stroke hover:border-dark-stroke bg-dark-active hover:bg-dark-hover text-dark-text1 font-medium transition"
                    >
                        {t('save-tags') || 'Save Tags'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default TagUsersModal;
