import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { templateApi } from '@/api/templates';
import { axiosClient } from '@/api/axios';
import { useUserContext } from '@/context/UserProvider';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/Modal';
import { toast } from 'react-toastify';

const ImportTemplateModal = ({ isOpen, template, onClose, onRefresh }) => {
    const { user } = useUserContext();
    const { t } = useTranslation("global");
    const queryClient = useQueryClient();
    const [selectedSpace, setSelectedSpace] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    // Fetch user spaces
    const { data: spaces = [] } = useQuery({
        queryKey: ['user-spaces'],
        queryFn: async () => {
            const res = await axiosClient.get('/spaces');
            return res.data;
        },
        enabled: !!user && isOpen,
    });

    // Handle import
    const handleImport = async () => {
        if (!selectedSpace) {
            toast.error(t('please-select-space'));
            return;
        }

        setIsImporting(true);
        try {
            await templateApi.importToSpace(template._id, selectedSpace);
            
            // Refresh spaces and tasks
            queryClient.invalidateQueries('spaces');
            queryClient.invalidateQueries('tasks');
            onRefresh();
            
            onClose();
            toast.success(t('template-imported-successfully'));
        } catch (error) {
            console.error('Error importing template:', error);
            toast.error(t('failed-to-import-template'));
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <>
                {/* Header */}
                <div className="border-b border-dark-stroke pb-4 mb-4">
                    <h2 className="text-xl font-bold text-dark-text1">{t('import-template')}</h2>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-dark-text2 mb-4">
                        {t('import-template-description', { templateName: template.name })}
                    </p>
                    
                    <div className="mb-4">
                        <label className="block text-dark-text1 mb-2">{t('select-space')}</label>
                        <select
                            value={selectedSpace}
                            onChange={(e) => setSelectedSpace(e.target.value)}
                            className="w-full px-3 py-2 bg-dark-bg2 border border-dark-stroke rounded-button text-dark-text1 focus:outline-none focus:ring-2 focus:ring-dark-blue-border"
                        >
                            <option value="">{t('select-space')}</option>
                            {spaces.map(space => (
                                <option key={space._id} value={space._id}>
                                    {space.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {template.tasks && template.tasks.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-dark-text1 mb-2">{t('tasks-to-be-created')}</h3>
                            <div className="bg-dark-active rounded-button border border-dark-stroke p-3 max-h-40 overflow-y-auto">
                                <ul className="space-y-1">
                                    {template.tasks.map((task, index) => (
                                        <li key={index} className="text-sm text-dark-text1 flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{task.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-dark-active hover:bg-dark-hover text-dark-text1 px-4 py-2 rounded-button border border-dark-stroke transition-colors"
                        disabled={isImporting}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={isImporting || !selectedSpace}
                        className="bg-dark-blue-border hover:opacity-90 text-white px-4 py-2 rounded-button transition-colors disabled:opacity-50"
                    >
                        {isImporting ? t('importing') : t('import')}
                    </button>
                </div>
            </>
        </Modal>
    );
};

export default ImportTemplateModal;