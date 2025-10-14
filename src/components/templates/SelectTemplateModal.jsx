import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { templateApi } from '@/api/templates';
import { axiosClient } from '@/api/axios';
import { useUserContext } from '@/context/UserProvider';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/Modal';
import { toast } from 'react-toastify';

const SelectTemplateModal = ({ isOpen, onClose, onTemplateSelected, spaceId }) => {
    const { user } = useUserContext();
    const { t } = useTranslation("global");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('mine'); // mine, shared, public

    // Fetch templates
    const { data: templates = [], isLoading } = useQuery({
        queryKey: ['task-templates', filter],
        queryFn: async () => {
            const res = await templateApi.getAll(filter);
            return res.data;
        },
        enabled: !!user && isOpen,
    });

    // Fetch user spaces
    const { data: spaces = [] } = useQuery({
        queryKey: ['user-spaces-for-template'],
        queryFn: async () => {
            const res = await axiosClient.get('/spaces');
            return res.data;
        },
        enabled: !!user && isOpen,
    });

    // Filter templates based on search term
    const filteredTemplates = templates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Handle template selection
    const handleSelectTemplate = async () => {
        if (selectedTemplate && spaceId) {
            try {
                await templateApi.importToSpace(selectedTemplate._id, spaceId);
                onTemplateSelected(selectedTemplate);
                toast.success(t('template-imported-successfully'));
                onClose();
            } catch (error) {
                console.error('Error importing template:', error);
                toast.error(t('failed-to-import-template'));
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <>
                {/* Header */}
                <div className="border-b border-dark-stroke pb-4 mb-4">
                    <h2 className="text-xl font-bold text-dark-text1">{t('select-template')}</h2>
                </div>

                {/* Search and Filters */}
                <div className="mb-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder={t('search-templates')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 bg-dark-bg2 border border-dark-stroke rounded-button text-dark-text1 focus:outline-none focus:ring-2 focus:ring-dark-blue-border"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setFilter('mine')}
                            className={`px-3 py-1 rounded-button text-sm ${
                                filter === 'mine' 
                                    ? 'bg-dark-active text-dark-text2' 
                                    : 'bg-dark-bg text-dark-text2 hover:bg-dark-hover'
                            }`}
                        >
                            {t('my-templates')}
                        </button>
                        <button 
                            onClick={() => setFilter('shared')}
                            className={`px-3 py-1 rounded-button text-sm ${
                                filter === 'shared' 
                                    ? 'bg-dark-active text-dark-text2' 
                                    : 'bg-dark-bg text-dark-text2 hover:bg-dark-hover'
                            }`}
                        >
                            {t('shared-with-me')}
                        </button>
                        <button 
                            onClick={() => setFilter('public')}
                            className={`px-3 py-1 rounded-button text-sm ${
                                filter === 'public' 
                                    ? 'bg-dark-active text-dark-text2' 
                                    : 'bg-dark-bg text-dark-text2 hover:bg-dark-hover'
                            }`}
                        >
                            {t('public-templates')}
                        </button>
                    </div>
                </div>

                {/* Templates List */}
                <div className="mb-6">
                    {isLoading ? (
                        <div className="text-center py-8 text-dark-text2">
                            {t('loading')}
                        </div>
                    ) : filteredTemplates.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {filteredTemplates.map(template => (
                                <div 
                                    key={template._id}
                                    onClick={() => setSelectedTemplate(template)}
                                    className={`p-3 rounded-button border cursor-pointer transition-all ${
                                        selectedTemplate?._id === template._id 
                                            ? 'border-dark-blue-border bg-dark-blue-border/10' 
                                            : 'border-dark-stroke hover:border-dark-stroke-hover hover:bg-dark-hover'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-dark-text1">{template.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-dark-text2">
                                                {template.tasksCount} {t('tasks')}
                                            </span>
                                        </div>
                                    </div>
                                    {template.description && (
                                        <p className="text-sm text-dark-text2 mt-1 line-clamp-2">
                                            {template.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2 text-xs">
                                        <span className="text-dark-text2">
                                            {t('created-by')}: {template.owner?.name || t('you')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-dark-text2">
                            {t('no-templates-found')}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-dark-active hover:bg-dark-hover text-dark-text1 px-4 py-2 rounded-button border border-dark-stroke transition-colors"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSelectTemplate}
                        disabled={!selectedTemplate || !spaceId}
                        className="bg-dark-active cursor-pointer hover:opacity-90 text-dark-text2 px-4 py-2 rounded-button transition-colors disabled:opacity-50"
                    >
                        {t('import')}
                    </button>
                </div>
            </>
        </Modal>
    );
};

export default SelectTemplateModal;