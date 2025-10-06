import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TaskStatusChart = ({ taskStatusData = [] }) => {
    return (
        <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-6'>
            <h3 className='text-dark-text1 text-lg font-semibold mb-6'>Task Status Distribution</h3>
            
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taskStatusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke)" horizontal={false} />
                    <XAxis 
                        type="number" 
                        stroke="var(--color-text2)"
                        tick={{ fill: 'var(--color-text2)', fontSize: 12 }}
                        axisLine={{ stroke: 'var(--color-stroke)' }}
                    />
                    <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="var(--color-text2)"
                        tick={{ fill: 'var(--color-text2)', fontSize: 12 }}
                        axisLine={{ stroke: 'var(--color-stroke)' }}
                        width={80}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'var(--color-bg2)', 
                            border: '1px solid var(--color-stroke)',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: 'var(--color-text1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                        }}
                        formatter={(value) => [`${value} tasks`, 'Count']}
                        cursor={{ fill: 'var(--color-stroke)' }}
                    />
                    <Bar 
                        dataKey="value" 
                        radius={[0, 8, 8, 0]}
                        animationDuration={1000}
                    >
                        {taskStatusData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            
            {/* Stats Cards */}
            <div className='grid grid-cols-2 gap-3 mt-6'>
                {taskStatusData.map((item, index) => (
                    <div 
                        key={index} 
                        className='p-4 bg-dark-active rounded-button border border-dark-stroke hover:border-dark-stroke-hover transition-all group'
                    >
                        <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center gap-2'>
                                <div 
                                    className='w-3 h-3 rounded-full' 
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <span className='text-sm text-dark-text2'>{item.name}</span>
                            </div>
                            <span className='text-lg font-bold text-dark-text1'>{item.value}</span>
                        </div>
                        {/* Mini progress bar */}
                        <div className='w-full bg-dark-bg rounded-full h-2 overflow-hidden'>
                            <div 
                                className='h-full rounded-full transition-all duration-700 group-hover:scale-x-105'
                                style={{ 
                                    width: `${(item.value / taskStatusData.reduce((sum, i) => sum + i.value, 0)) * 100}%`,
                                    backgroundColor: item.color,
                                    transformOrigin: 'left'
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Total Summary */}
            <div className='mt-4 p-4 bg-dark-active rounded-button border border-dark-stroke text-center'>
                <p className='text-3xl font-bold text-dark-text1'>
                    {taskStatusData.reduce((sum, item) => sum + item.value, 0)}
                </p>
                <p className='text-xs text-dark-text2 mt-2'>Total Tasks</p>
            </div>
        </div>
    );
};

export default TaskStatusChart;

