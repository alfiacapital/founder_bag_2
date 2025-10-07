import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { useUserContext } from '@/context/UserProvider';
import UserMenu from '@/components/UserMenu';
import { services } from '@/utils/servicesConfig';

function Navbar({ setSidebarOpen }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout, darkMode, setDarkMode } = useUserContext()

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="flex items-center justify-between px-4 md:px-6 py-2 bg-dark-bg2 border-b border-dark-stroke">
            <div className="flex items-center gap-2">
                {/* Sidebar Toggle Button - Large Screens */}
                <button 
                    onClick={() => setSidebarOpen(prev => !prev)}
                    className="hidden xl:flex p-2 hover:bg-dark-hover rounded-button transition-all duration-300 border border-transparent hover:border-dark-stroke"
                    aria-label="Toggle sidebar"
                >
                    <HiMenuAlt2 className="text-2xl text-dark-text2 hover:text-dark-text1" />
                </button>

                <div ref={dropdownRef} className="relative inline-block">
                    {/* Logo button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center space-x-2 hover:bg-dark-hover border border-dark-stroke m-2
                         rounded-lg px-3 py-2 hover:border-dark-stroke
                         transition"
                    >
                        {darkMode ? (
                            <img src={"/ALFIA_SYSTEM.png"} alt="Logo" className="h-6" />
                        ) : (
                            <img src={"/ALFIA_SYSTEM_DARK.png"} alt="Logo" className="h-6" />
                        )}
                        <IoIosArrowDown className="w-4 h-4 text-dark-text1" />
                    </button>

                    {/* Dropdown Cards with transition */}
                    <div
                        className={`absolute left-0 mt-3 
                          w-[calc(100vw-2rem)] sm:w-[500px] md:w-[600px] lg:w-[700px]
                          max-w-[700px]
                          max-h-[calc(100vh-100px)]
                          overflow-y-auto
                          bg-dark-bg 
                          border border-dark-stroke 
                          rounded-button shadow-lg p-3 
                          grid grid-cols-1 sm:grid-cols-2 gap-2 z-50
                          transform transition-all duration-300 ease-out
                          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                    >
                        {services.map((service, idx) => (
                            <div
                                onClick={() => {
                                    if (service.url) window.open(service.url, "_blank"), setOpen(false);
                                }}
                                key={idx}
                                className="flex flex-col justify-start 
                                  h-[100px] sm:h-[120px]
                                  bg-dark-bg2
                                  border border-dark-stroke hover:border-dark-stroke
                                  rounded-button px-3 sm:px-4 py-2 sm:py-3 cursor-pointer transition "
                            >
                                <div className="flex flex-col">
                                    <span className="text-base sm:text-lg font-semibold text-dark-text1">
                                        {service.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <nav className="hidden md:flex items-center space-x-3  ">
                <span
                    
                    className="text-dark-text1 cursor-pointer text-sm border border-dark-stroke rounded-button px-4 py-2 hover:border-dark-stroke hover:text-dark-text1 hover:border-dark-stroke hover:bg-dark-hover font-bold
                     transition-all duration-300"
                >
                    Support Portal
                </span>
                <span
                    
                    className="text-dark-text1 cursor-pointer text-sm border border-dark-stroke rounded-button px-4 py-2 hover:border-dark-stroke hover:text-dark-text1 hover:border-dark-stroke hover:bg-dark-hover font-bold
                     transition-all duration-300"
                >
                    Manage Funds
                </span>
                <span
                    
                    className="text-dark-text2 cursor-pointer text-sm border border-dark-stroke rounded-button px-4 py-2 hover:border-dark-stroke hover:text-dark-text1 hover:border-dark-stroke hover:bg-dark-hover font-bold
                     transition-all duration-300"
                >
                    Docs
                </span>
                <UserMenu />
            </nav>

            <button 
                onClick={() => {
                    console.log("open sidebar")
                    setSidebarOpen(true)
                }}
                className="xl:hidden p-2 hover:bg-dark-hover hover:border hover:border-dark-stroke rounded transition-all duration-300"
                aria-label="Open sidebar"
            >
                <FaBars className="text-2xl text-dark-text1" />
            </button>
        </header>
    );
}

export default Navbar;