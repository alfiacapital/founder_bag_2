import React, { useState } from 'react';
import { templateApi } from '@/api/templates';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/Modal';
import { toast } from 'react-toastify';

const EditTemplateModal = ({ isOpen, template, onClose, onRefresh }) => {
    const { t } = useTranslation("global");
    const queryClient = useQueryClient();
    const [name, setName] = useState(template.name);
    const [description, setDescription] = useState(template.description || '');
    const [visibility, setVisibility] = useState(template.visibility || 'private');
    const [isSaving, setIsSaving] = useState(false);

    // Handle save
    const handleSave = async () => {
        if (!name.trim()) {
            toast.error(t('template-name-required'));
            return;
        }

        setIsSaving(true);
        try {
            await templateApi.update(template._id, {
                name,
                description,
                visibility
            });
            
            queryClient.invalidateQueries('task-templates');
            onRefresh();
            
            onClose();
            toast.success(t('template-updated-successfully'));
        } catch (error) {
            console.error('Error updating template:', error);
            toast.error(t('failed-to-update-template'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <>
                {/* Header */}
                <div className="border-b border-dark-stroke pb-4 mb-4">
                    <h2 className="text-xl font-bold text-dark-text1">{t('edit-template')}</h2>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <div className="mb-4">
                        <label className="block text-dark-text1 mb-2">{t('template-name')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-dark-bg2 border border-dark-stroke rounded-button text-dark-text1 focus:outline-none focus:ring-2 focus:ring-dark-blue-border"
                            placeholder={t('enter-template-name')}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-dark-text1 mb-2">{t('description')}</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-dark-bg2 border border-dark-stroke rounded-button text-dark-text1 focus:outline-none focus:ring-2 focus:ring-dark-blue-border"
                            placeholder={t('enter-template-description')}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-dark-text1 mb-2">{t('visibility')}</label>
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="w-full px-3 py-2 bg-dark-bg2 border border-dark-stroke rounded-button text-dark-text1 focus:outline-none focus:ring-2 focus:ring-dark-blue-border"
                        >
                            <option value="private">{t('private')}</option>
                            <option value="public">{t('public')}</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-dark-active hover:bg-dark-hover text-dark-text1 px-4 py-2 rounded-button border border-dark-stroke transition-colors"
                        disabled={isSaving}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !name.trim()}
                        className="bg-dark-blue-border hover:opacity-90 text-white px-4 py-2 rounded-button transition-colors disabled:opacity-50"
                    >
                        {isSaving ? t('saving') : t('save')}
                    </button>
                </div>
            </>
        </Modal>
    );
};

export default EditTemplateModal;