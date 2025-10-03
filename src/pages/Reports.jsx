import Menu from '@/components/Menu';
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/api/axios.jsx';
import { useUserContext } from '@/context/UserProvider';

function Reports() {
    const { user } = useUserContext();
    const [timeRange, setTimeRange] = useState('week'); // week, month, year
    const [selectedSpace, setSelectedSpace] = useState(null);

    // Fetch Summary Statistics
    const { data: summary, isLoading: summaryLoading } = useQuery({
        queryKey: ['reports-summary', selectedSpace],
        queryFn: async () => {
            const url = selectedSpace 
                ? `/reports/summary?spaceId=${selectedSpace}`
                : '/reports/summary';
            const res = await axiosClient.get(url);
            return res.data;
        },
        enabled: !!user,
    });

    // Fetch Activity Data
    const { data: activityData = [], isLoading: activityLoading } = useQuery({
        queryKey: ['reports-activity', timeRange, selectedSpace],
        queryFn: async () => {
            const spaceParam = selectedSpace ? `&spaceId=${selectedSpace}` : '';
            const res = await axiosClient.get(`/reports/activity?timeRange=${timeRange}${spaceParam}`);
            return res.data;
        },
        enabled: !!user,
    });

    // Fetch Productivity Metrics
    const { data: productivity, isLoading: productivityLoading } = useQuery({
        queryKey: ['reports-productivity', selectedSpace],
        queryFn: async () => {
            const url = selectedSpace 
                ? `/reports/productivity?spaceId=${selectedSpace}`
                : '/reports/productivity';
            const res = await axiosClient.get(url);
            return res.data;
        },
        enabled: !!user,
    });

    // Fetch Task Status Distribution
    const { data: taskStatusData = [], isLoading: taskStatusLoading } = useQuery({
        queryKey: ['reports-task-status', selectedSpace],
        queryFn: async () => {
            const url = selectedSpace 
                ? `/reports/task-status?spaceId=${selectedSpace}`
                : '/reports/task-status';
            const res = await axiosClient.get(url);
            return res.data;
        },
        enabled: !!user,
    });

    // Fetch Space Activity
    const { data: spaceActivityData = [], isLoading: spaceActivityLoading } = useQuery({
        queryKey: ['reports-space-activity'],
        queryFn: async () => {
            const res = await axiosClient.get('/reports/space-activity');
            return res.data;
        },
        enabled: !!user,
    });

    // Fetch User Spaces for filter dropdown
    const { data: spaces = [] } = useQuery({
        queryKey: ['reports-spaces'],
        queryFn: async () => {
            const res = await axiosClient.get('/reports/spaces');
            return res.data;
        },
        enabled: !!user,
    });

    // Check if any data is loading
    const isLoading = summaryLoading || activityLoading || productivityLoading || taskStatusLoading || spaceActivityLoading;

    // Loading State - Skeleton
    if (isLoading) {
        return (
            <>
                {/* Top bar skeleton */}
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 w-32 bg-dark-active animate-pulse rounded-button"></div>
                    <div className="h-6 w-48 bg-dark-active animate-pulse rounded"></div>
                </div>

                {/* 4 Summary Cards Skeleton */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6'>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className='rounded-button border border-dark-stroke bg-dark-bg2 p-4'>
                            <div className='h-4 w-24 bg-dark-active animate-pulse rounded mb-4'></div>
                            <div className='h-6 w-16 bg-dark-active animate-pulse rounded'></div>
                        </div>
                    ))}
                </div>

                {/* Activity Chart Skeleton */}
                <div className='mb-6'>
                    <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-6'>
                        <div className='flex justify-between items-center mb-6'>
                            <div className='h-6 w-40 bg-dark-active animate-pulse rounded'></div>
                            <div className='flex gap-2'>
                                <div className='h-8 w-16 bg-dark-active animate-pulse rounded-button'></div>
                                <div className='h-8 w-16 bg-dark-active animate-pulse rounded-button'></div>
                                <div className='h-8 w-16 bg-dark-active animate-pulse rounded-button'></div>
                            </div>
                        </div>
                        <div className='h-[350px] bg-dark-active animate-pulse rounded'></div>
                    </div>
                </div>

                {/* 3 Productivity Cards Skeleton */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='rounded-button border border-dark-stroke bg-dark-bg2 p-4'>
                            <div className='h-4 w-32 bg-dark-active animate-pulse rounded mb-4'></div>
                            <div className='h-6 w-20 bg-dark-active animate-pulse rounded'></div>
                        </div>
                    ))}
                </div>

                {/* 2 Bottom Charts Skeleton */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    {/* Pie Chart Skeleton */}
                    <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-6'>
                        <div className='h-6 w-48 bg-dark-active animate-pulse rounded mb-6'></div>
                        <div className='h-[300px] flex items-center justify-center'>
                            <div className='w-48 h-48 rounded-full bg-dark-active animate-pulse'></div>
                        </div>
                        <div className='flex justify-center gap-4 mt-4'>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className='flex items-center gap-2'>
                                    <div className='w-3 h-3 rounded-full bg-dark-active animate-pulse'></div>
                                    <div className='h-4 w-20 bg-dark-active animate-pulse rounded'></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Space Activity Skeleton */}
                    <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-6'>
                        <div className='h-6 w-56 bg-dark-active animate-pulse rounded mb-6'></div>
                        <div className='space-y-4'>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className='space-y-2'>
                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-2 h-2 rounded-full bg-dark-active animate-pulse'></div>
                                            <div className='h-4 w-24 bg-dark-active animate-pulse rounded'></div>
                                        </div>
                                        <div className='flex items-center gap-4'>
                                            <div className='h-4 w-16 bg-dark-active animate-pulse rounded'></div>
                                            <div className='h-4 w-10 bg-dark-active animate-pulse rounded'></div>
                                        </div>
                                    </div>
                                    <div className='w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden'>
                                        <div className='h-full w-3/4 bg-dark-active animate-pulse rounded-full'></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* top bar - select space and show actual timezone */}
            <div className={"flex justify-between items-center"}>
                {/* space select */}
                <div className='flex justify-between items-center gap-2'>
                    <Menu
                        button={
                            <button className="pt-1.5 px-3 mb-2 rounded-button border border-dark-stroke hover:bg-dark-hover cursor-pointer text-dark-text2 hover:text-white hover:border-[#444444]">
                                {selectedSpace 
                                    ? spaces.find(s => s._id === selectedSpace)?.name 
                                    : 'All Spaces'}
                            </button>
                        }
                        items={[
                            {
                                label: "All Spaces",
                                onClick: () => setSelectedSpace(null),
                            },
                            ...spaces.map(space => ({
                                label: space.name,
                                onClick: () => setSelectedSpace(space._id)
                            }))
                        ]}
                    />
                </div>
                <div className='text-dark-text2'>
                    Timezone: <span className='text-white'>{new Date().toLocaleString()}</span>
                </div>
            </div>
            
            {/* 4 cards (total spaces, total tasks, total notes, total events) */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6'>
                <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-4'>
                    <h3 className='text-dark-text2 text-md font-medium'>Total Spaces</h3>
                    <p className='text-white pt-4 text-md'>
                        {summary?.totalSpaces || 0} {summary?.totalSpaces === 1 ? 'Space' : 'Spaces'}
                    </p>
                </div>
                <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-4'>
                    <h3 className='text-dark-text2 text-md font-medium'>Total Tasks</h3>
                    <p className='text-white pt-4 text-md'>
                        {summary?.totalTasks || 0} {summary?.totalTasks === 1 ? 'Task' : 'Tasks'}
                    </p>
                </div>
                <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-4'>
                    <h3 className='text-dark-text2 text-md font-medium'>Total Notes</h3>
                    <p className='text-white pt-4 text-md'>
                        {summary?.totalNotes || 0} {summary?.totalNotes === 1 ? 'Note' : 'Notes'}
                    </p>
                </div>
                <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-4'>
                    <h3 className='text-dark-text2 text-md font-medium'>Total Events</h3>
                    <p className='text-white pt-4 text-md'>
                        {summary?.totalEvents || 0} {summary?.totalEvents === 1 ? 'Event' : 'Events'}
                    </p>
                </div>
            </div>
            
            {/* Activity Chart (show spaces, notes, tasks, events in week, month, year) */}
            <div className='my-6'>
                <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-6'>
                    {/* Chart Header with Time Range Selector */}
                    <div className='flex justify-between items-center mb-6'>
                        <h3 className='text-white text-lg font-semibold'>Activity Overview</h3>
                        <div className='flex gap-2'>
                            <button
                                onClick={() => setTimeRange('week')}
                                className={`px-4 pt-1.5 rounded-button text-sm transition-colors ${
                                    timeRange === 'week'
                                        ? 'bg-dark-active text-white border border-[#444444]'
                                        : 'border border-dark-stroke text-dark-text2 hover:text-white hover:bg-dark-hover hover:border-[#444444]'
                                }`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setTimeRange('month')}
                                className={`px-4 pt-1.5 rounded-button text-sm transition-colors ${
                                    timeRange === 'month'
                                        ? 'bg-dark-active text-white border border-[#444444]'
                                        : 'border border-dark-stroke text-dark-text2 hover:text-white hover:bg-dark-hover hover:border-[#444444]'
                                }`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setTimeRange('year')}
                                className={`px-4 pt-1.5 rounded-button text-sm transition-colors ${
                                    timeRange === 'year'
                                        ? 'bg-dark-active text-white border border-[#444444]'
                                        : 'border border-dark-stroke text-dark-text2 hover:text-white hover:bg-dark-hover hover:border-[#444444]'
                                }`}
                            >
                                Year
                            </button>
                        </div>
                    </div>

                    {/* Area Chart */}
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={activityData}>
                            <defs>
                                <linearGradient id="colorSpaces" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1a1a1a', 
                                    border: '1px solid #1f1f1f',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend wrapperStyle={{ color: '#9ca3af' }} />
                            <Area type="monotone" dataKey="spaces" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSpaces)" />
                            <Area type="monotone" dataKey="tasks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTasks)" />
                            <Area type="monotone" dataKey="notes" stroke="#22c55e" fillOpacity={1} fill="url(#colorNotes)" />
                            <Area type="monotone" dataKey="events" stroke="#f59e0b" fillOpacity={1} fill="url(#colorEvents)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3 cards (most productive hour, most productive day, most productive month) */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-4'>
                    <h3 className='text-dark-text2 text-md font-medium'>Most Productive Hour</h3>
                    <p className='text-white pt-4 text-md'>
                        {productivity?.mostProductiveHour || '--:--'}
                    </p>
                </div>
                <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-4'>
                    <h3 className='text-dark-text2 text-md font-medium'>Most Productive Day</h3>
                    <p className='text-white pt-4 text-md'>
                        {productivity?.mostProductiveDay || '--'}
                    </p>
                </div>
                <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-4'>
                    <h3 className='text-dark-text2 text-md font-medium'>Most Productive Month</h3>
                    <p className='text-white pt-4 text-md'>
                        {productivity?.mostProductiveMonth || '--'}
                    </p>
                </div>
            </div>

            {/* 2 Additional Charts - Task Status Distribution & Space Activity */}
            <div className='my-6'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    
                    {/* Task Status Distribution - Pie Chart */}
                    <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-6'>
                        <h3 className='text-white text-lg font-semibold mb-6'>Task Status Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={taskStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {taskStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1a1a1a', 
                                        border: '1px solid #1f1f1f',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        
                        {/* Legend */}
                        <div className='flex justify-center gap-4 mt-4'>
                            {taskStatusData.map((item, index) => (
                                <div key={index} className='flex items-center gap-2'>
                                    <div 
                                        className='w-3 h-3 rounded-full' 
                                        style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className='text-sm text-dark-text2'>{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Space Activity - Custom Progress Cards */}
                    <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-6'>
                        <h3 className='text-white text-lg font-semibold mb-6'>Space Activity & Completion</h3>
                        <div className='space-y-4'>
                            {spaceActivityData.map((space, index) => (
                                <div key={index} className='space-y-2'>
                                    {/* Space Info Row */}
                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center gap-3'>
                                            <div 
                                                className='w-2 h-2 rounded-full'
                                                style={{ backgroundColor: ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'][index % 5] }}
                                            ></div>
                                            <span className='text-white font-medium'>{space.name}</span>
                                        </div>
                                        <div className='flex items-center gap-4'>
                                            <span className='text-sm text-dark-text2'>{space.tasks} tasks</span>
                                            <span className='text-sm font-semibold text-white'>{space.completion}%</span>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className='w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden'>
                                        <div 
                                            className='h-full rounded-full transition-all duration-500 ease-out'
                                            style={{ 
                                                width: `${space.completion}%`,
                                                backgroundColor: ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'][index % 5]
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Summary Stats */}
                        {spaceActivityData.length > 0 && (
                            <div className='mt-6 pt-6 border-t border-dark-stroke flex justify-around'>
                                <div className='text-center'>
                                    <p className='text-2xl font-bold text-white'>
                                        {spaceActivityData.reduce((sum, space) => sum + space.tasks, 0)}
                                    </p>
                                    <p className='text-sm text-dark-text2 mt-1'>Total Tasks</p>
                                </div>
                                <div className='text-center'>
                                    <p className='text-2xl font-bold text-white'>
                                        {Math.round(spaceActivityData.reduce((sum, space) => sum + space.completion, 0) / spaceActivityData.length)}%
                                    </p>
                                    <p className='text-sm text-dark-text2 mt-1'>Avg Completion</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </>
    );
}

export default Reports;
