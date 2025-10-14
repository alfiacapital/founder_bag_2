import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { templateApi } from '@/api/templates';
import { useUserContext } from '@/context/UserProvider';
import { useTranslation } from 'react-i18next';
import { 
    TemplateCard, 
    CreateTemplateModal, 
    TemplateSkeleton 
} from '@/components/templates';

function Templates() {
    const { user } = useUserContext();
    const { t } = useTranslation("global");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filter, setFilter] = useState('all'); // all, mine, shared, public
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch templates
    const { data: templates = [], isLoading, refetch } = useQuery({
        queryKey: ['task-templates', filter],
        queryFn: async () => {
            const res = await templateApi.getAll(filter);
            return res.data;
        },
        enabled: !!user,
    });

    // Filter templates based on search term
    const filteredTemplates = templates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <TemplateSkeleton />;
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-dark-text1">{t('templates')}</h1>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-dark-blue-border hover:opacity-90 text-white px-4 py-2 rounded-button flex items-center gap-2 transition-colors"
                >
                    <span>+ {t('create-template')}</span>
                </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex gap-2">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-button ${filter === 'all' ? 'bg-dark-blue-border text-white' : 'bg-dark-active text-dark-text2'}`}
                    >
                        {t('all')}
                    </button>
                    <button 
                        onClick={() => setFilter('mine')}
                        className={`px-3 py-1 rounded-button ${filter === 'mine' ? 'bg-dark-blue-border text-white' : 'bg-dark-active text-dark-text2'}`}
                    >
                        {t('my-templates')}
                    </button>
                    <button 
                        onClick={() => setFilter('shared')}
                        className={`px-3 py-1 rounded-button ${filter === 'shared' ? 'bg-dark-blue-border text-white' : 'bg-dark-active text-dark-text2'}`}
                    >
                        {t('shared-with-me')}
                    </button>
                    <button 
                        onClick={() => setFilter('public')}
                        className={`px-3 py-1 rounded-button ${filter === 'public' ? 'bg-dark-blue-border text-white' : 'bg-dark-active text-dark-text2'}`}
                    >
                        {t('public-templates')}
                    </button>
                </div>
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder={t('search-templates')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 bg-dark-bg2 border border-dark-stroke rounded-button text-dark-text1 focus:outline-none focus:ring-2 focus:ring-dark-blue-border"
                    />
                </div>
            </div>

            {/* Templates Grid */}
            {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map(template => (
                        <TemplateCard 
                            key={template._id} 
                            template={template} 
                            onRefresh={refetch}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-dark-text2">{t('no-templates-found')}</p>
                </div>
            )}

            {/* Create Template Modal */}
            {showCreateModal && (
                <CreateTemplateModal 
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onRefresh={refetch}
                />
            )}
        </div>
    );
}

export default Templates;