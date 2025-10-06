import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { useUserContext } from '@/context/UserProvider';
import Menu from '@/components/Menu';
import { getUserImage } from '@/utils/getUserImage';
import { setCookie } from '@/utils/cookieUtils';

function generateFakeKey(length = 256) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

export const services = [
    { name: 'A-LINK', icon: 'red', available: true, url: `https://alink.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'FOUNDER BAG', icon: 'blue', available: true, url: `https://founder.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'EAAS', icon: 'purple', available: true, url: `https://eaas.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'STARTUP', icon: 'blue', available: true, url: `https://startup.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'A-BRAIN', icon: 'yellow', available: true, url: `https://abrain.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'WORKSPACE', icon: 'yellow', available: true, url: "" },
];

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
                <Menu
                    button={
                        <img src={getUserImage(user.image)} alt="Avatar" className="h-10 w-10 rounded-full border border-dark-stroke hover:border-dark-stroke hover:bg-dark-hover" />
                    }
                    items={[
                        {
                            label: "Profile",
                            onClick: () => window.location.href = import.meta.env.VITE_MAIN_APP_URL+"/user/profile?tab=information",
                        },
                        {
                            label: "Logout",
                            onClick: async () => {
                                logout()
                                window.location.href = import.meta.env.VITE_MAIN_APP_URL
                            },
                        },
                    ]}
                    footer={
                        <div className="px-3 py-2 border-t border-dark-stroke">
                            <p className="text-xs text-dark-text1 mb-2 pt-2">
                                Theme
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setDarkMode(false)
                                        setCookie("darkMode", false, 365);
                                    }}
                                    className={`flex-1 px-2 py-1.5 rounded-button text-xs font-medium transition-all duration-200 ${
                                        !darkMode
                                            ? "bg-dark-active text-dark-text1 border border-dark-stroke"
                                            : "hover:bg-dark-hover text-dark-text2 border border-transparent"
                                    }`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => {
                                        setDarkMode(true)
                                        setCookie("darkMode", true, 365);
                                    }}
                                    className={`flex-1 px-2 py-1.5 rounded-button text-xs font-medium transition-all duration-200 ${
                                        darkMode
                                            ? "bg-dark-active text-dark-text1 border border-dark-stroke"
                                            : "hover:bg-dark-hover text-dark-text2 border border-transparent"
                                    }`}
                                >
                                    Dark
                                </button>
                            </div>
                        </div>
                    }
                />
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