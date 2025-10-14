import React, { useState } from 'react';
import { templateApi } from '@/api/templates';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/Modal';
import { toast } from 'react-toastify';

const ShareTemplateModal = ({ isOpen, template, onClose, onRefresh }) => {
    const { t } = useTranslation("global");
    const queryClient = useQueryClient();
    const [email, setEmail] = useState('');
    const [isSharing, setIsSharing] = useState(false);

    // Handle share
    const handleShare = async () => {
        if (!email) {
            toast.error(t('please-enter-email'));
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error(t('please-enter-valid-email'));
            return;
        }

        setIsSharing(true);
        try {
            await templateApi.share(template._id, email);
            
            queryClient.invalidateQueries('task-templates');
            onRefresh();
            
            setEmail('');
            toast.success(t('template-shared-successfully'));
        } catch (error) {
            console.error('Error sharing template:', error);
            toast.error(t('failed-to-share-template'));
        } finally {
            setIsSharing(false);
        }
    };

    // Handle remove user
    const handleRemoveUser = async (userId) => {
        try {
            await templateApi.removeShare(template._id, userId);
            queryClient.invalidateQueries('task-templates');
            onRefresh();
            toast.success(t('user-removed-successfully'));
        } catch (error) {
            console.error('Error removing user:', error);
            toast.error(t('failed-to-remove-user'));
        }
    };

    // Handle visibility toggle
    const handleVisibilityToggle = async (isPublic) => {
        try {
            await templateApi.update(template._id, {
                visibility: isPublic ? 'public' : 'private'
            });
            queryClient.invalidateQueries('task-templates');
            onRefresh();
            toast.success(t('template-visibility-updated'));
        } catch (error) {
            console.error('Error updating visibility:', error);
            toast.error(t('failed-to-update-visibility'));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <>
                {/* Header */}
                <div className="border-b border-dark-stroke pb-4 mb-4">
                    <h2 className="text-xl font-bold text-dark-text1">{t('share-template')}</h2>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-dark-text2 mb-4">
                        {t('share-template-description')}
                    </p>
                    
                    {/* Share with user */}
                    <div className="mb-4">
                        <label className="block text-dark-text1 mb-2">{t('share-with-user')}</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('enter-user-email')}
                                className="flex-1 px-3 py-2 bg-dark-bg2 border border-dark-stroke rounded-button text-dark-text1 focus:outline-none focus:ring-2 focus:ring-dark-blue-border"
                                disabled={isSharing}
                            />
                            <button
                                onClick={handleShare}
                                disabled={isSharing || !email}
                                className="bg-dark-blue-border hover:opacity-90 text-white px-4 py-2 rounded-button transition-colors disabled:opacity-50"
                            >
                                {t('share')}
                            </button>
                        </div>
                    </div>

                    {/* Visibility Toggle */}
                    <div className="mb-4">
                        <label className="block text-dark-text1 mb-2">{t('template-visibility')}</label>
                        <div className="flex items-center justify-between bg-dark-active p-3 rounded-button border border-dark-stroke">
                            <span className="text-dark-text1">
                                {template.visibility === 'public' ? t('public-template') : t('private-template')}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={template.visibility === 'public'}
                                    onChange={(e) => handleVisibilityToggle(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-blue-border"></div>
                            </label>
                        </div>
                    </div>

                    {/* Shared users */}
                    {template.sharedWith && template.sharedWith.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-dark-text1 mb-2">{t('shared-with')}</h3>
                            <div className="space-y-2">
                                {template.sharedWith.map(user => (
                                    <div 
                                        key={user._id} 
                                        className="flex justify-between items-center bg-dark-active p-2 rounded-button border border-dark-stroke"
                                    >
                                        <span className="text-dark-text1">{user.email}</span>
                                        <button
                                            onClick={() => handleRemoveUser(user._id)}
                                            className="text-red-500 hover:text-red-400"
                                        >
                                            {t('remove')}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-dark-active hover:bg-dark-hover text-dark-text1 px-4 py-2 rounded-button border border-dark-stroke transition-colors"
                    >
                        {t('close')}
                    </button>
                </div>
            </>
        </Modal>
    );
};

export default ShareTemplateModal;