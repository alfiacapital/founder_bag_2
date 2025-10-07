import React from 'react';
import { FiFolder, FiCheckSquare, FiFileText, FiCalendar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
const SummaryCards = ({ summary = {} }) => {
    const { t } = useTranslation("global");
    const cards = [
        {
            title: t('total-spaces'),
            value: summary?.totalSpaces || 0,
            label: summary?.totalSpaces === 1 ? t('space') : t('spaces'),
            icon: FiFolder,
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: t('total-tasks'),
            value: summary?.totalTasks || 0,
            label: summary?.totalTasks === 1 ? t('task') : t('tasks'),
            icon: FiCheckSquare,
            color: 'from-green-500 to-green-600'
        },
        {
            title: t('total-notes'),
            value: summary?.totalNotes || 0,
            label: summary?.totalNotes === 1 ? t('note') : t('notes'),
            icon: FiFileText,
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: t('total-events'),
            value: summary?.totalEvents || 0,
            label: summary?.totalEvents === 1 ? t('event') : t('events'),
            icon: FiCalendar,
            color: 'from-orange-500 to-orange-600'
        }
    ];

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
            {cards.map((card, index) => (
                <div key={index} className='rounded-button border border-dark-stroke bg-dark-bg2 p-4'>
                    {/* Icon with gradient background */}
                    <div className={`w-12 h-12 rounded-lg bg-dark-active flex items-center justify-center mb-3`}>
                        <card.icon className="w-6 h-6 text-dark-text1" />
                    </div>
                    
                    <h3 className='text-dark-text1 text-md font-medium'>{card.title}</h3>
                    <p className='text-dark-text2 pt-2 text-md'>
                        {card.value} {card.label}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;

