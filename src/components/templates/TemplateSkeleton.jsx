import React from 'react';

const TemplateSkeleton = () => {
    return (
        <div className="p-6">
            {/* Header skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="h-8 bg-dark-active rounded w-32"></div>
                <div className="h-10 bg-dark-active rounded w-32"></div>
            </div>

            {/* Filters skeleton */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-8 bg-dark-active rounded w-20"></div>
                    ))}
                </div>
                <div className="flex-1 h-10 bg-dark-active rounded"></div>
            </div>

            {/* Template cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-dark-active rounded-button border border-dark-stroke p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="h-5 bg-dark-stroke rounded w-3/4"></div>
                            <div className="h-5 bg-dark-stroke rounded w-16"></div>
                        </div>
                        <div className="space-y-2 mb-3">
                            <div className="h-4 bg-dark-stroke rounded"></div>
                            <div className="h-4 bg-dark-stroke rounded w-5/6"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-4 bg-dark-stroke rounded w-1/3"></div>
                            <div className="h-4 bg-dark-stroke rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateSkeleton;