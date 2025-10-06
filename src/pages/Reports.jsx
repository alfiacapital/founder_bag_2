import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Menu from '@/components/Menu';
import { axiosClient } from '@/api/axios.jsx';
import { useUserContext } from '@/context/UserProvider';
import SummaryCards from '@/components/reports/SummaryCards';
import ActivityChart from '@/components/reports/ActivityChart';
import ProductivityCards from '@/components/reports/ProductivityCards';
import TaskStatusChart from '@/components/reports/TaskStatusChart';
import SpaceActivityChart from '@/components/reports/SpaceActivityChart';
import ReportsSkeleton from '@/components/reports/ReportsSkeleton';

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

    // Loading State
    if (isLoading) {
        return <ReportsSkeleton />;
    }

    return (
        <>
            {/* top bar - select space and show actual timezone */}
            <div className={"flex justify-between items-center"}>
                {/* space select */}
                <div className='flex justify-between items-center gap-2'>
                    <Menu
                        button={
                            <button className="pt-1.5 px-3 mb-2 rounded-button border border-dark-stroke hover:bg-dark-hover cursor-pointer text-dark-text2 hover:text-dark-text1 hover:border-dark-stroke-hover">
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
                    Timezone: <span className='text-dark-text1'>{new Date().toLocaleString()}</span>
                </div>
            </div>
            
            {/* Summary Cards */}
            <SummaryCards summary={summary} />
            
            {/* Activity Chart */}
            <div className='my-6'>
                <ActivityChart 
                    activityData={activityData} 
                    timeRange={timeRange} 
                    setTimeRange={setTimeRange} 
                />
            </div>

            {/* Productivity Cards */}
            <ProductivityCards productivity={productivity} />

            {/* Charts Grid */}
            <div className='my-6'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <TaskStatusChart taskStatusData={taskStatusData} />
                    <SpaceActivityChart spaceActivityData={spaceActivityData} />
                </div>
            </div>

        </>
    );
}

export default Reports;
