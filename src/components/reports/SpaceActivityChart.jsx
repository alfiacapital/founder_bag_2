import React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SpaceActivityChart = ({ spaceActivityData = [], selectedSpace }) => {
    const { t } = useTranslation("global");
    const colors = ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];
    const gradientColors = ['#a78bfa', '#60a5fa', '#4ade80', '#fbbf24', '#f87171'];

    useEffect(() => { 
        console.log('SpaceActivityChart - selectedSpace:', selectedSpace);
        console.log('SpaceActivityChart - spaceActivityData:', spaceActivityData);
    }, [selectedSpace, spaceActivityData]);
    
    // Filter spaces based on selectedSpace
    const filteredSpaces = spaceActivityData.filter(space => 
        selectedSpace ? space.spaceId === selectedSpace : true
    );

    return (
        <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-6'>
            <h3 className='text-dark-text1 text-lg font-semibold mb-6'>{t('space-activity-completion')}</h3>
            
            <div className='space-y-3 overflow-y-auto max-h-[calc(100vh-30rem)]'>
                {filteredSpaces.map((space, index) => (
                    <div 
                        key={space.spaceId || index} 
                        className='p-4 bg-dark-active rounded-button border border-dark-stroke hover:border-dark-stroke-hover transition-all group'
                    >
                        {/* Space Info Row */}
                        <div className='flex justify-between items-center mb-3'>
                            <div className='flex items-center gap-3'>
                                <div 
                                    className='w-3 h-3 rounded-full'
                                    style={{ backgroundColor: colors[index % 5] }}
                                ></div>
                                <span className='text-dark-text1 font-medium'>{space.name || 'Unnamed Space'}</span>
                            </div>
                            <div className='flex items-center gap-4'>
                                <span className='text-sm text-dark-text2'>{(space.tasks || 0)} {t('tasks-count')}</span>
                                <span className='text-lg font-bold text-dark-text1'>{(space.completion || 0)}%</span>
                            </div>
                        </div>
                        
                        {/* Progress Bar - Enhanced */}
                        <div className='relative w-full bg-dark-bg rounded-full h-3 overflow-hidden'>
                            <div 
                                className='h-full rounded-full transition-all duration-700 ease-out group-hover:scale-x-105'
                                style={{ 
                                    width: `${(space.completion || 0)}%`,
                                    background: `linear-gradient(90deg, ${colors[index % 5]}, ${gradientColors[index % 5]})`,
                                    transformOrigin: 'left'
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Summary Stats - Enhanced */}
            {filteredSpaces.length > 0 && (
                <div className='mt-6 pt-6 border-t border-dark-stroke grid grid-cols-2 gap-3'>
                    <div className='p-4 bg-dark-active rounded-button border border-dark-stroke text-center'>
                        <p className='text-3xl font-bold text-dark-text1'>
                            {filteredSpaces.reduce((sum, space) => sum + (space.tasks || 0), 0)}
                        </p>
                        <p className='text-xs text-dark-text2 mt-2'>{t('total-tasks')}</p>
                    </div>
                    <div className='p-4 bg-dark-active rounded-button border border-dark-stroke text-center'>
                        <p className='text-3xl font-bold text-dark-text1'>
                            {(() => {
                                const totalCompletion = filteredSpaces.reduce((sum, space) => sum + (space.completion || 0), 0);
                                const averageCompletion = filteredSpaces.length > 0 ? Math.round(totalCompletion / filteredSpaces.length) : 0;
                                return `${averageCompletion}%`;
                            })()}
                        </p>
                        <p className='text-xs text-dark-text2 mt-2'>{t('avg-completion')}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpaceActivityChart;