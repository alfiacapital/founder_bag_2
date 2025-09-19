import React from 'react';
import { FaRegCalendarCheck, FaTimes } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";
import { GoSearch } from "react-icons/go";
import { LiaHomeSolid } from "react-icons/lia";
import { FiPlus } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";


function SideBar({ sidebarOpen, setSidebarOpen }) {
    const {pathname} = useLocation();
    // Menu items data for better organization
    const mainMenuItems = [
        { icon: GoSearch, label: "Search", id: "search" },
        { icon: LiaHomeSolid , label: "Home", id: "home", active: pathname === "/" },
        { image: "/alfia-ai.png", label: "Alfia AI", id: "alfia-ai" },
        { icon: FaRegCalendarCheck , label: "Calendar", id: "calendar" }
    ];

    const listMenuItems = [
        { label: "All my lists", id: "all-lists" },
        { label: "Archived lists", id: "archived-lists" }
    ];

    const privateItems = [
        { icon: FiPlus , label: "Add new", id: "add-private" }
    ];

    const sharedItems = [
        { icon: FiPlus , label: "Add new", id: "add-shared" }
    ];

    const trashItem = { icon: IoTrashOutline , label: "Trash", id: "trash" };

    // Menu item component for reusability
    const MenuItem = ({ icon: Icon, image, label, onClick, className = "" }) => (
        <div 
            className={`flex items-center gap-2 p-[0.5px] px-4 rounded-button hover:bg-dark-hover text-dark-text2 hover:text-white cursor-pointer transition-colors duration-200 ${className}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            {Icon && <Icon className="text-xl text-dark-text2  transition-colors duration-200" />}
            {image && <img src={image} alt={label} className="h-7 w-7" />}
            <span className="text-sm  font-bold pt-1  transition-colors duration-200">{label}</span>
        </div>
    );

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
                    fixed xl:static inset-y-0 left-0 z-40 
                    w-72 sm:w-80 md:w-72 xl:w-[360px]
                    bg-black xl:py-6 px-6 xl:px-8
                    transform transition-all duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0 py-6" : "-translate-x-full"} 
                    xl:translate-x-0
                    flex flex-col h-screen xl:h-full xl:my-0
                    shadow-xl xl:shadow-none xl:ml-0
                `}
            >
               

                {/* Header - Mobile close button */}
                <div className="flex justify-between items-center xl:hidden mb-6">
                    <h1 className="text-lg font-bold text-white">ALFIA SYSTEM</h1>
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 hover:bg-gray-800 rounded-button transition-colors duration-200"
                        aria-label="Close sidebar"
                    >
                        <FaTimes className="text-xl text-white" />
                    </button>
                </div>

                {/* Lists Section */}
                <div className="bg-dark-bg2 p-4 rounded-default mb-5 xl:mb-2 border border-dark-stroke">
                    {/* Search Input */}
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                            <HiPlus  className="h-4 w-4 text-dark-text2" />
                        </div>
                        <input
                            type="text"
                            placeholder="Create new list"
                            className="w-full pl-7 pr-4 py-2 text-sm border-b border-dark-stroke  text-dark-text2 placeholder-[#9b9b96] focus:outline-none  transition-colors duration-200"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        {listMenuItems.map((item) => (
                            <MenuItem 
                                key={item.id}
                                label={item.label}
                                onClick={() => console.log(`Clicked ${item.id}`)}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 bg-dark-bg2 p-4 rounded-default mb-4 xl:mb-0 border border-dark-blue-border overflow-y-auto sidebar-nav-scroll flex flex-col">
                    <div className="space-y-2 flex-1">
                        {/* Main menu items */}
                        {mainMenuItems.map((item) => (
                            <MenuItem 
                                key={item.id}
                                icon={item.icon}
                                image={item.image}
                                label={item.label}
                                onClick={() => console.log(`Clicked ${item.id}`)}
                            />
                        ))}

                        {/* Private section */}
                        <div className="mt-6">
                            <p className="text-sm font-bold text-dark-text2 px-4 mt-2">Private</p>
                            {privateItems.map((item) => (
                                <MenuItem 
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    onClick={() => console.log(`Clicked ${item.id}`)}
                                />
                            ))}
                        </div>

                        {/* Shared section */}
                        <div className="mt-4">
                            <p className="text-sm font-bold text-dark-text2  mb-2 px-4">Shared</p>
                            {sharedItems.map((item) => (
                                <MenuItem 
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    onClick={() => console.log(`Clicked ${item.id}`)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Trash - positioned at bottom */}
                    <div className="mt-auto pt-4 ">
                        <MenuItem 
                            icon={trashItem.icon}
                            label={trashItem.label}
                            onClick={() => console.log(`Clicked ${trashItem.id}`)}
                        />
                    </div>
                </nav>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 xl:hidden backdrop-blur-sm"
                    aria-label="Close sidebar"
                />
            )}
        </>
    );
}

export default SideBar;
