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
                <h3 className='text-white text-lg font-semibold'>Activity Overview</h3>
                <div className='flex gap-2'>
                    {timeRangeButtons.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setTimeRange(value)}
                            className={`px-4 pt-1.5 rounded-button text-sm transition-colors ${
                                timeRange === value
                                    ? 'bg-dark-active text-white border border-[#444444]'
                                    : 'border border-dark-stroke text-dark-text2 hover:text-white hover:bg-dark-hover hover:border-[#444444]'
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="#9b9b96" 
                        tick={{ fill: '#9b9b96', fontSize: 12 }}
                        axisLine={{ stroke: '#1f1f1f' }}
                    />
                    <YAxis 
                        stroke="#9b9b96" 
                        tick={{ fill: '#9b9b96', fontSize: 12 }}
                        axisLine={{ stroke: '#1f1f1f' }}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#070707', 
                            border: '1px solid #1f1f1f',
                            borderRadius: '8px',
                            padding: '12px',
                            color: '#fff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                        }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}
                    />
                    <Legend 
                        wrapperStyle={{ 
                            paddingTop: '20px',
                            color: '#9b9b96' 
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

