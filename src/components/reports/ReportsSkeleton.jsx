import React from 'react';

const ReportsSkeleton = () => {
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
                {/* Bar Chart Skeleton */}
                <div className='rounded-button border border-dark-stroke bg-dark-bg2 p-6'>
                    <div className='h-6 w-48 bg-dark-active animate-pulse rounded mb-6'></div>
                    <div className='h-[300px] bg-dark-active animate-pulse rounded'></div>
                    <div className='grid grid-cols-2 gap-3 mt-6'>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className='h-20 bg-dark-active animate-pulse rounded-button'></div>
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
};

export default ReportsSkeleton;

