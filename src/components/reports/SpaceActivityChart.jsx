import React from 'react';

const SpaceActivityChart = ({ spaceActivityData = [] }) => {
    const colors = ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];
    const gradientColors = ['#a78bfa', '#60a5fa', '#4ade80', '#fbbf24', '#f87171'];

    return (
        <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-6'>
            <h3 className='text-white text-lg font-semibold mb-6'>Space Activity & Completion</h3>
            
            <div className='space-y-3'>
                {spaceActivityData?.slice(0, 5)?.map((space, index) => (
                    <div 
                        key={index} 
                        className='p-4 bg-dark-active rounded-button border border-dark-stroke hover:border-[#444444] transition-all group'
                    >
                        {/* Space Info Row */}
                        <div className='flex justify-between items-center mb-3'>
                            <div className='flex items-center gap-3'>
                                <div 
                                    className='w-3 h-3 rounded-full'
                                    style={{ backgroundColor: colors[index % 5] }}
                                ></div>
                                <span className='text-white font-medium'>{space.name}</span>
                            </div>
                            <div className='flex items-center gap-4'>
                                <span className='text-sm text-dark-text2'>{space.tasks} tasks</span>
                                <span className='text-lg font-bold text-white'>{space.completion}%</span>
                            </div>
                        </div>
                        
                        {/* Progress Bar - Enhanced */}
                        <div className='relative w-full bg-dark-bg rounded-full h-3 overflow-hidden'>
                            <div 
                                className='h-full rounded-full transition-all duration-700 ease-out group-hover:scale-x-105'
                                style={{ 
                                    width: `${space.completion}%`,
                                    background: `linear-gradient(90deg, ${colors[index % 5]}, ${gradientColors[index % 5]})`,
                                    transformOrigin: 'left'
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Summary Stats - Enhanced */}
            {spaceActivityData.length > 0 && (
                <div className='mt-6 pt-6 border-t border-dark-stroke grid grid-cols-2 gap-3'>
                    <div className='p-4 bg-dark-active rounded-button border border-dark-stroke text-center'>
                        <p className='text-3xl font-bold text-white'>
                            {spaceActivityData.reduce((sum, space) => sum + space.tasks, 0)}
                        </p>
                        <p className='text-xs text-dark-text2 mt-2'>Total Tasks</p>
                    </div>
                    <div className='p-4 bg-dark-active rounded-button border border-dark-stroke text-center'>
                        <p className='text-3xl font-bold text-white'>
                            {Math.round(spaceActivityData.reduce((sum, space) => sum + space.completion, 0) / spaceActivityData.length)}%
                        </p>
                        <p className='text-xs text-dark-text2 mt-2'>Avg Completion</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpaceActivityChart;

