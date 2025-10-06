import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { BiErrorCircle, BiRefresh, BiHome } from 'react-icons/bi';

/**
 * Error page for React Router errors
 * This catches routing errors and displays them beautifully
 */
function RouterErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    console.error('Router Error:', error);

    const handleReload = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-8 overflow-auto">
            <div className="max-w-4xl w-full">
                {/* Error Icon and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/10 rounded-full mb-6 animate-pulse">
                        <BiErrorCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-dark-text1 mb-4">
                        Oops! Something Went Wrong
                    </h1>
                    <p className="text-lg text-dark-text2 max-w-2xl mx-auto">
                        We encountered an unexpected error. Don't worry, your data is safe 
                        and we're here to help you get back on track.
                    </p>
                </div>

                {/* Error Message Card */}
                <div className="bg-dark-bg2 border border-dark-stroke rounded-button p-6 mb-6">
                    <h2 className="text-xl font-semibold text-dark-text1 mb-4">
                        Error Details
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-sm font-semibold text-dark-text2 mb-2">Message:</h3>
                            <p className="text-red-400 font-mono text-sm bg-dark-active p-3 rounded-button border border-dark-stroke break-all">
                                {error?.message || error?.statusText || 'Unknown error occurred'}
                            </p>
                        </div>

                        {/* Stack Trace in Development */}
                        {import.meta.env.DEV && error?.stack && (
                            <div>
                                <h3 className="text-sm font-semibold text-dark-text2 mb-2">Stack Trace:</h3>
                                <pre className="text-xs text-dark-text2 bg-dark-active p-3 rounded-button border border-dark-stroke overflow-x-auto max-h-48 overflow-y-auto">
                                    {error.stack}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <button
                        onClick={handleReload}
                        className="flex-1 group relative px-6 py-4 bg-white hover:bg-gray-100 text-black rounded-button font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <BiRefresh className="text-2xl relative z-10" />
                        <span className="relative z-10">Reload Page</span>
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="flex-1 px-6 py-4 bg-dark-bg2 hover:bg-dark-active text-dark-text1 rounded-button font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 border border-dark-stroke hover:border-dark-text2"
                    >
                        <BiHome className="text-2xl" />
                        <span>Go to Dashboard</span>
                    </button>
                </div>

                {/* Help Section */}
                <div className="bg-dark-bg2 border border-dark-stroke rounded-button p-6">
                    <h3 className="text-lg font-semibold text-dark-text1 mb-3">
                        What can you do?
                    </h3>
                    <ul className="space-y-2 text-dark-text2">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Try reloading the page - sometimes a simple refresh fixes the issue</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Go back to the dashboard and try a different route</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Clear your browser cache and cookies</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>If the problem persists, contact support with the error details above</span>
                        </li>
                    </ul>
                </div>

                
            </div>
        </div>
    );
}

export default RouterErrorPage;

