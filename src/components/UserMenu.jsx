import React, { useState, useRef, useEffect } from "react";
import { getUserImage } from '@/utils/getUserImage';
import { setCookie } from '@/utils/cookieUtils';
import { useUserContext } from '@/context/UserProvider';
import { FaRegUser } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import { MdOutlineLanguage, MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";
import i18n from "@/i18n";
import ThemeTransition from './ThemeTransition';

function UserMenu() {
    const [open, setOpen] = useState(false);
    const [showTransition, setShowTransition] = useState(false);
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

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang).then(() => {
            document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
            document.documentElement.lang = lang;
            setCookie("language", lang, 365);
        });
    };

    const handleThemeChange = (newDarkMode) => {
        setShowTransition(true);
        setOpen(false);
        
        // Apply theme change after transition starts
        setTimeout(() => {
            setDarkMode(newDarkMode);
            setCookie("darkMode", newDarkMode, 365);
        }, 200);
    };

    const handleTransitionComplete = () => {
        setShowTransition(false);
    };


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
                    className={`absolute ${i18n.dir() === "ltr" ? "right-0" : "left-0"} mt-1 w-48 origin-top-right rounded-default bg-dark-bg2 border border-dark-stroke shadow-lg z-50`}
                >
                    <div className="px-3 py-2 border-b border-dark-stroke">
                        <p className="text-sm font-medium capitalize truncate text-dark-text1 pt-1 pl-1">{user.full_name}</p>
                        <p className="text-xs font-medium truncate text-dark-text2 pt-1 pl-1">{user.email}</p>
                    </div>
                   <button
                        onClick={() => {
                            setOpen(false);
                             window.location.href = import.meta.env.VITE_MAIN_APP_URL+"/user/profile?tab=information"
                        }}
                        className={`flex items-center w-full px-4 py-2 text-dark-text1 font-medium pt-2 text-left text-sm cursor-pointer hover:bg-dark-hover`}
                    >
                        <FaRegUser />
                        <span className="pt-1 px-2 ">Profile</span>
                    </button>
                    {/* language Toggle  */}
                    <div className="px-3  ">
                        <p className="text-xs text-dark-text1 mb-2 pt-2 pl-1">
                            Language
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    i18n.dir() === "rtl" && changeLanguage("en")
                                }}
                                className={`flex-1 px-2 py-1.5 rounded-button text-xs font-medium transition-all duration-200 ${
                                    i18n.dir() === "ltr"
                                        ? "bg-dark-active text-dark-text1 border border-dark-stroke"
                                        : "hover:bg-dark-hover text-dark-text2 border border-transparent"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <MdOutlineLanguage className="mb-1 "/>
                                    English
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    i18n.dir() === "ltr" && changeLanguage("ar")
                                }}
                                className={`flex-1 px-2 py-1.5 rounded-button text-xs font-medium transition-all duration-200 ${
                                    i18n.dir() === "rtl"
                                        ? "bg-dark-active text-dark-text1 border border-dark-stroke"
                                        : "hover:bg-dark-hover text-dark-text2 border border-transparent"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <MdOutlineLanguage className="mb-1 "/>
                                    Arabic
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Theme Toggle  */}
                    <div className="px-3 py-2 ">
                        <p className="text-xs text-dark-text1 mb-2 pt-2 pl-1">
                            Theme
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleThemeChange(false)}
                                className={`flex-1 px-2 py-1.5 rounded-button text-xs font-medium transition-all duration-200 ${
                                    !darkMode
                                        ? "bg-dark-active text-dark-text1 border border-dark-stroke"
                                        : "hover:bg-dark-hover text-dark-text2 border border-transparent"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <MdOutlineLightMode />
                                    Light
                                </div>
                            </button>
                            <button
                                onClick={() => handleThemeChange(true)}
                                className={`flex-1 px-2 py-1.5 rounded-button text-xs font-medium transition-all duration-200 ${
                                    darkMode
                                        ? "bg-dark-active text-dark-text1 border border-dark-stroke"
                                        : "hover:bg-dark-hover text-dark-text2 border border-transparent"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <MdOutlineNightlight />
                                    Dark
                                </div>
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setOpen(false);
                            logout()
                            window.location.href = import.meta.env.VITE_MAIN_APP_URL
                        }}
                        className={`flex items-center w-full px-4 py-2 text-dark-text1 font-medium pt-2 text-left text-sm cursor-pointer hover:bg-dark-hover`}
                    >
                        <RxExit />
                        <span className="pt-1 px-2 ">Logout</span>
                    </button>
                </div>
            )}
            
            {/* Theme Transition */}
            {/* <ThemeTransition 
                isActive={showTransition} 
                onComplete={handleTransitionComplete} 
            /> */}
        </div>
    );
}

export default UserMenu;

