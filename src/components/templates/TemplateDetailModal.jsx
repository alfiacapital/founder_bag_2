import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { templateApi } from '@/api/templates';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/Modal';
import ShareTemplateModal from './ShareTemplateModal';
import EditTemplateModal from './EditTemplateModal';
import { toast } from 'react-toastify';

const TemplateDetailModal = ({ isOpen, template, onClose, onImport, onRefresh }) => {
    const { t } = useTranslation("global");
    const queryClient = useQueryClient();
    const [showShareModal, setShowShareModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Get visibility label
    const getVisibilityLabel = () => {
        switch (template.visibility) {
            case 'public': return t('public');
            case 'shared': return t('shared');
            case 'private': return t('private');
            default: return t('private');
        }
    };

    // Handle delete template
    const handleDelete = async () => {
        if (window.confirm(t('confirm-delete-template'))) {
            try {
                await templateApi.delete(template._id);
                queryClient.invalidateQueries('task-templates');
                onRefresh();
                onClose();
                toast.success(t('template-deleted-successfully'));
            } catch (error) {
                console.error('Error deleting template:', error);
                toast.error(t('failed-to-delete-template'));
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <>
                {/* Header */}
                <div className="border-b border-dark-stroke pb-4 mb-4">
                    <h2 className="text-xl font-bold text-dark-text1">{template.name}</h2>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-dark-text2 mb-4">{template.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4 text-sm">
                        <div className="bg-dark-active px-3 py-1 rounded-button">
                            <span className="text-dark-text2">{t('created-by')}: </span>
                            <span className="text-dark-text1">
                                {template.owner?.name || t('you')}
                            </span>
                        </div>
                        <div className="bg-dark-active px-3 py-1 rounded-button">
                            <span className="text-dark-text2">{t('last-updated')}: </span>
                            <span className="text-dark-text1">
                                {formatDate(template.updatedAt)}
                            </span>
                        </div>
                        <div className="bg-dark-active px-3 py-1 rounded-button">
                            <span className="text-dark-text2">{t('visibility')}: </span>
                            <span className="text-dark-text1">
                                {getVisibilityLabel()}
                            </span>
                        </div>
                        <div className="bg-dark-active px-3 py-1 rounded-button">
                            <span className="text-dark-text2">{template.tasksCount} </span>
                            <span className="text-dark-text1">{t('tasks')}</span>
                        </div>
                    </div>

                    {/* Task Structure Preview */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-dark-text1 mb-3">{t('tasks-structure')}</h3>
                        <div className="bg-dark-active rounded-button border border-dark-stroke p-4">
                            {template.tasks && template.tasks.length > 0 ? (
                                <ul className="space-y-2">
                                    {template.tasks.map((task, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span className="text-dark-text1">{task.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-dark-text2">{t('no-tasks-in-template')}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onImport}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-button transition-colors"
                    >
                        {t('import-template')}
                    </button>
                    
                    {template.isOwner && (
                        <>
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="bg-dark-active hover:bg-dark-hover text-dark-text1 px-4 py-2 rounded-button border border-dark-stroke transition-colors"
                            >
                                {t('edit')}
                            </button>
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="bg-dark-active hover:bg-dark-hover text-dark-text1 px-4 py-2 rounded-button border border-dark-stroke transition-colors"
                            >
                                {t('share')}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-button transition-colors"
                            >
                                {t('delete')}
                            </button>
                        </>
                    )}
                </div>

                {/* Share Template Modal */}
                {showShareModal && (
                    <ShareTemplateModal 
                        isOpen={showShareModal}
                        template={template}
                        onClose={() => setShowShareModal(false)}
                        onRefresh={onRefresh}
                    />
                )}

                {/* Edit Template Modal */}
                {showEditModal && (
                    <EditTemplateModal 
                        isOpen={showEditModal}
                        template={template}
                        onClose={() => setShowEditModal(false)}
                        onRefresh={onRefresh}
                    />
                )}
            </>
        </Modal>
    );
};

export default TemplateDetailModal;