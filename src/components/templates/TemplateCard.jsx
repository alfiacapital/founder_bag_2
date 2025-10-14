import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { templateApi } from '@/api/templates';
import { useQueryClient } from '@tanstack/react-query';
import TemplateDetailModal from './TemplateDetailModal';
import ImportTemplateModal from './ImportTemplateModal';

const TemplateCard = ({ template, onRefresh }) => {
    const { t } = useTranslation("global");
    const queryClient = useQueryClient();
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

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

    // Get visibility class
    const getVisibilityClass = () => {
        switch (template.visibility) {
            case 'public': return 'bg-green-500';
            case 'shared': return 'bg-dark-blue-border';
            case 'private': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    // Handle delete template
    const handleDelete = async () => {
        if (window.confirm(t('confirm-delete-template'))) {
            try {
                await templateApi.delete(template._id);
                queryClient.invalidateQueries('task-templates');
                onRefresh();
            } catch (error) {
                console.error('Error deleting template:', error);
            }
        }
    };

    return (
        <>
            <div 
                className="bg-dark-active rounded-button border border-dark-stroke p-4 hover:border-dark-stroke-hover transition-all cursor-pointer"
                onClick={() => setShowDetailModal(true)}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-dark-text1 truncate">{template.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${getVisibilityClass()}`}>
                        {getVisibilityLabel()}
                    </span>
                </div>
                
                <p className="text-sm text-dark-text2 mb-3 line-clamp-2">
                    {template.description || t('no-description')}
                </p>
                
                <div className="flex justify-between items-center text-xs text-dark-text2">
                    <div>
                        {template.owner?.name ? (
                            <span>{t('created-by')}: {template.owner.name}</span>
                        ) : (
                            <span>{t('created-by')}: {t('you')}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span>{template.tasksCount} {t('tasks')}</span>
                        <span>•</span>
                        <span>{formatDate(template.createdAt)}</span>
                    </div>
                </div>
                
                {template.isOwner && (
                    <div className="flex justify-end mt-3 pt-2 border-t border-dark-stroke">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                            className="text-red-500 hover:text-red-400 text-sm"
                        >
                            {t('delete')}
                        </button>
                    </div>
                )}
            </div>

            {/* Template Detail Modal */}
            {showDetailModal && (
                <TemplateDetailModal 
                    isOpen={showDetailModal}
                    template={template}
                    onClose={() => setShowDetailModal(false)}
                    onImport={() => {
                        setShowDetailModal(false);
                        setShowImportModal(true);
                    }}
                    onRefresh={onRefresh}
                />
            )}

            {/* Import Template Modal */}
            {showImportModal && (
                <ImportTemplateModal 
                    isOpen={showImportModal}
                    template={template}
                    onClose={() => setShowImportModal(false)}
                    onRefresh={onRefresh}
                />
            )}
        </>
    );
};

export default TemplateCard;