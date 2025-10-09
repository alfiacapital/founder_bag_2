import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserProvider';

function ThemeTransition({ isActive, onComplete }) {
    const [isVisible, setIsVisible] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const { darkMode } = useUserContext();

    useEffect(() => {
        if (isActive) {
            setIsVisible(true);
            // Show content after slide-in starts
            setTimeout(() => setShowContent(true), 200);
            
            // Trigger transition after a short delay
            const timer = setTimeout(() => {
                setShowContent(false);
                setTimeout(() => {
                    setIsVisible(false);
                    // Call onComplete after transition ends
                    setTimeout(() => {
                        onComplete();
                    }, 500); // Match transition duration
                }, 100);
            }, 1200);
            
            return () => clearTimeout(timer);
        }
    }, [isActive, onComplete]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Main transition overlay */}
            <div 
                className={`absolute inset-0 transition-transform duration-700 ease-out ${
                    isVisible ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{
                    background: darkMode 
                        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
                }}
            >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-bounce"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '0.5s'}}></div>
                </div>

                {/* Content overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                    showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                    <div className="text-center">
                        {/* Animated theme icon */}
                        <div className="relative mb-6">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${
                                darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-900 text-yellow-400'
                            }`}>
                                {darkMode ? (
                                    <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </div>
                            
                            {/* Pulsing rings */}
                            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping"></div>
                            <div className="absolute inset-0 rounded-full border border-purple-400/20 animate-ping" style={{animationDelay: '0.2s'}}></div>
                        </div>

                        {/* Loading text with typewriter effect */}
                        <div className="mb-4">
                            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-500 ${
                                darkMode ? 'text-yellow-400' : 'text-gray-900'
                            }`}>
                                {darkMode ? 'Switching to Dark Mode' : 'Switching to Light Mode'}
                            </h3>
                            <div className="flex items-center justify-center space-x-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-48 h-1 bg-gray-300/20 rounded-full mx-auto overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse transform translate-x-0"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThemeTransition;
