import React, { useState, useRef, useEffect } from "react";
import { getUserImage } from '@/utils/getUserImage';
import { setCookie } from '@/utils/cookieUtils';
import { useUserContext } from '@/context/UserProvider';

function UserMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const { user, logout, darkMode, setDarkMode } = useUserContext();

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            {/* Trigger button */}
            <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
                <img 
                    src={getUserImage(user.image)} 
                    alt="Avatar" 
                    className="h-10 w-10 rounded-full border border-dark-stroke hover:border-dark-stroke hover:bg-dark-hover" 
                />
            </div>

            {/* Dropdown menu */}
            {open && (
                <div 
                    className="absolute right-0 mt-1 w-48 origin-top-right rounded-lg bg-dark-bg2 border border-dark-stroke shadow-lg z-50"
                >
                   <button
                        onClick={() => {
                            setOpen(false);
                             window.location.href = import.meta.env.VITE_MAIN_APP_URL+"/user/profile?tab=information"
                        }}
                        className={`w-full px-4 py-2 text-dark-text1 pt-3 text-left text-sm cursor-pointer`}
                    >
                        Profile
                    </button>
                    {/* Theme Toggle Footer */}
                    <div className="px-3 py-2 border-t border-dark-stroke">
                        <p className="text-xs text-dark-text1 mb-2 pt-2 pl-1">
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
                    <button
                        onClick={() => {
                            setOpen(false);
                            logout()
                            window.location.href = import.meta.env.VITE_MAIN_APP_URL
                        }}
                        className={`w-full px-4 py-2 dark-text1 pt-3 text-left text-sm cursor-pointer`}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserMenu;

