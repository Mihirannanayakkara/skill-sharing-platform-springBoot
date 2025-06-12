import React from 'react';

const LoadingSkeleton = ({ type = 'default', count = 1 }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'post':
                return (
                    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/6 mt-2"></div>
                            </div>
                        </div>
                        <div className="h-24 bg-gray-300 rounded"></div>
                    </div>
                );

            case 'sidebar':
                return (
                    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                );

            case 'card':
                return (
                    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                        <div className="h-20 bg-gray-300 rounded"></div>
                    </div>
                );

            default:
                return (
                    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index}>{renderSkeleton()}</div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;