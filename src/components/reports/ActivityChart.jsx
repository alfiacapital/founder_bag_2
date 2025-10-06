import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ActivityChart = ({ activityData = [], timeRange, setTimeRange }) => {
    const timeRangeButtons = [
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' }
    ];

    return (
        <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-6'>
            {/* Chart Header with Time Range Selector */}
            <div className='flex justify-between items-center mb-6'>
                <h3 className='text-dark-text1 text-lg font-semibold'>Activity Overview</h3>
                <div className='flex gap-2'>
                    {timeRangeButtons.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setTimeRange(value)}
                            className={`px-4 pt-1.5 rounded-button text-sm transition-colors ${
                                timeRange === value
                                    ? 'bg-dark-active text-dark-text1 border border-dark-stroke'
                                    : 'border border-dark-stroke text-dark-text2 hover:text-dark-text1 hover:bg-dark-hover hover:border-dark-stroke-hover'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Area Chart */}
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorSpaces" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke)" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="var(--color-text2)" 
                        tick={{ fill: 'var(--color-text2)', fontSize: 12 }}
                        axisLine={{ stroke: 'var(--color-stroke)' }}
                    />
                    <YAxis 
                        stroke="var(--color-text2)" 
                        tick={{ fill: 'var(--color-text2)', fontSize: 12 }}
                        axisLine={{ stroke: 'var(--color-stroke)' }}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'var(--color-bg2)', 
                            border: '1px solid var(--color-stroke)',
                            borderRadius: '8px',
                            padding: '12px',
                            color: 'var(--color-text1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                        }}
                        labelStyle={{ color: 'var(--color-text1)', fontWeight: 'bold', marginBottom: '8px' }}
                    />
                    <Legend 
                        wrapperStyle={{ 
                            paddingTop: '20px',
                            color: 'var(--color-text2)' 
                        }}
                        iconType="circle"
                    />
                    <Area 
                        type="monotone" 
                        dataKey="spaces" 
                        name="Spaces"
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorSpaces)" 
                        animationDuration={1000}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="tasks" 
                        name="Tasks"
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorTasks)" 
                        animationDuration={1000}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="notes" 
                        name="Notes"
                        stroke="#22c55e" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorNotes)" 
                        animationDuration={1000}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="events" 
                        name="Events"
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorEvents)" 
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;

