import React, { useState } from 'react';
import { templateApi } from '@/api/templates';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/Modal';
import { toast } from 'react-toastify';

const CreateTemplateFromTaskModal = ({ isOpen, task, onClose, onRefresh }) => {
    const { t } = useTranslation("global");
    const [name, setName] = useState(`Template from "${task.title}"`);
    const [description, setDescription] = useState(task.description || '');
    const [visibility, setVisibility] = useState('private');
    const [isCreating, setIsCreating] = useState(false);

    // Handle create
    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error(t('template-name-required'));
            return;
        }

        setIsCreating(true);
        try {
            await templateApi.createFromTask(task._id, {
                name,
                description,
                visibility
            });
            
            onRefresh();
            onClose();
            toast.success(t('template-created-successfully'));
        } catch (error) {
            console.error('Error creating template:', error);
            toast.error(t('failed-to-create-template'));
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <>
                {/* Header */}
                <div className="border-b border-dark-stroke pb-4 mb-4">
                    <h2 className="text-xl font-bold text-dark-text1">{t('create-template-from-task')}</h2>
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
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-dark-text1 mb-2">{t('description')}</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-dark-bg2 border border-dark-stroke rounded-button text-dark-text1 focus:outline-none focus:ring-2 focus:ring-dark-blue-border"
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
                        disabled={isCreating}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={isCreating || !name.trim()}
                        className="bg-dark-active cursor-pointer hover:opacity-90 text-dark-text1 px-4 py-2 rounded-button transition-colors disabled:opacity-50"
                    >
                        {isCreating ? t('creating') : t('create')}
                    </button>
                </div>
            </>
        </Modal>
    );
};

export default CreateTemplateFromTaskModal;