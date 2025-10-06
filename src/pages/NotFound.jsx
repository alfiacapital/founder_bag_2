import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiHome, BiArrowBack } from 'react-icons/bi';
import { MdOutlineExplore } from 'react-icons/md';

function NotFound() {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div 
                    className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
                    style={{
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                        transition: 'transform 0.3s ease-out'
                    }}
                ></div>
                <div 
                    className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
                    style={{
                        transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
                        transition: 'transform 0.3s ease-out',
                        animationDelay: '1s'
                    }}
                ></div>
            </div>

            <div className="max-w-4xl w-full text-center relative z-10">
                {/* Animated 404 */}
                <div className="mb-8 relative">
                    <h1 
                        className="text-[clamp(6rem,20vw,12rem)] font-black text-dark-text1 leading-none mb-4 select-none"
                        style={{
                            transform: `perspective(500px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
                            transition: 'transform 0.1s ease-out',
                            textShadow: '0 0 80px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        404
                    </h1>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                        <div className="absolute top-10 left-[20%] w-8 h-8 border-2 border-dark-stroke rounded-lg animate-float"></div>
                        <div className="absolute top-20 right-[15%] w-6 h-6 border-2 border-dark-stroke rounded-full animate-float-delayed"></div>
                        <div className="absolute bottom-10 left-[15%] w-10 h-10 border-2 border-dark-stroke rotate-45 animate-float-slow"></div>
                        <div className="absolute bottom-20 right-[20%] w-7 h-7 border-2 border-dark-stroke rounded-lg animate-float"></div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8 space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark-text1">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-lg text-dark-text2 max-w-xl mx-auto">
                        The page you're looking for seems to have wandered off into the digital wilderness. 
                        Let's get you back on track!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <button
                        onClick={() => navigate('/')}
                        className="group relative px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-button font-semibold text-lg transition-all duration-300 flex items-center gap-3 overflow-hidden min-w-[200px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <BiHome className="text-2xl relative z-10" />
                        <span className="relative z-10">Go Home</span>
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="group px-8 py-4 bg-dark-bg2 hover:bg-dark-active text-dark-text1 rounded-button font-semibold text-lg transition-all duration-300 flex items-center gap-3 border border-dark-stroke hover:border-dark-text2 min-w-[200px]"
                    >
                        <BiArrowBack className="text-2xl group-hover:-translate-x-1 transition-transform duration-300" />
                        <span>Go Back</span>
                    </button>
                </div>

                {/* Error Code */}
                <div className="mt-8">
                    <p className="text-sm text-dark-text2 font-mono">
                        ERROR CODE: 404 | PAGE_NOT_FOUND
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                    }
                }

                @keyframes float-delayed {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-25px) rotate(180deg);
                    }
                }

                @keyframes float-slow {
                    0%, 100% {
                        transform: translateY(0) rotate(45deg);
                    }
                    50% {
                        transform: translateY(-15px) rotate(225deg);
                    }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-float-delayed {
                    animation: float-delayed 4s ease-in-out infinite;
                    animation-delay: 0.5s;
                }

                .animate-float-slow {
                    animation: float-slow 5s ease-in-out infinite;
                    animation-delay: 1s;
                }
            `}</style>
        </div>
    );
}

export default NotFound;
