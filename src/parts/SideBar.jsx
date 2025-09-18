import React from 'react';
import { FaCalendarAlt, FaHome, FaPlus, FaSearch, FaTimes, FaTrash } from "react-icons/fa";

function SideBar({ sidebarOpen, setSidebarOpen }) {
    // Menu items data for better organization
    const mainMenuItems = [
        { icon: FaSearch, label: "Search", id: "search" },
        { icon: FaHome, label: "Home", id: "home" },
        { icon: FaCalendarAlt, label: "Calendar", id: "calendar" }
    ];

    const listMenuItems = [
        { label: "All my lists", id: "all-lists" },
        { label: "Archived lists", id: "archived-lists" }
    ];

    const privateItems = [
        { icon: FaPlus, label: "Add new", id: "add-private" }
    ];

    const sharedItems = [
        { icon: FaPlus, label: "Add new", id: "add-shared" }
    ];

    const trashItem = { icon: FaTrash, label: "Trash", id: "trash" };

    // Menu item component for reusability
    const MenuItem = ({ icon: Icon, label, onClick, className = "" }) => (
        <div 
            className={`flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer transition-colors duration-200 ${className}`}
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
            {Icon && <Icon className="text-sm text-white" />}
            <span className="text-sm">{label}</span>
        </div>
    );

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-40 
                    w-64 sm:w-72 lg:w-64 
                    bg-black  lg:py-6 pl-8
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    lg:translate-x-0
                    flex flex-col h-screen lg:h-full lg:my-4
                `}
            >
                {/* Header - Mobile close button */}
                <div className="flex justify-between items-center lg:hidden mb-6">
                    <h1 className="text-sm font-bold text-white">ALFIA SYSTEM</h1>
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 hover:bg-gray-800 rounded transition-colors duration-200"
                        aria-label="Close sidebar"
                    >
                        <FaTimes className="text-xl text-white" />
                    </button>
                </div>

                {/* Lists Section */}
                <div className="bg-dark-bg2 p-4 rounded-default mb-0 lg:mb-2 border border-dark-stroke">
                    
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
                <nav className="flex-1 bg-dark-bg2 p-4 rounded-default mb-4 lg:mb-6 border border-dark-blue-border overflow-y-auto">
                    <div className="space-y-2">
                        {/* Main menu items */}
                        {mainMenuItems.map((item) => (
                            <MenuItem 
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                onClick={() => console.log(`Clicked ${item.id}`)}
                            />
                        ))}

                        {/* Private section */}
                        <div className="mt-6">
                            <p className="text-xs text-gray-400 mb-2 font-medium">Private</p>
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
                            <p className="text-xs text-gray-400 mb-2 font-medium">Shared</p>
                            {sharedItems.map((item) => (
                                <MenuItem 
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    onClick={() => console.log(`Clicked ${item.id}`)}
                                />
                            ))}
                        </div>

                        {/* Trash */}
                        <div className="mt-6 pt-4 border-t border-gray-700">
                            <MenuItem 
                                icon={trashItem.icon}
                                label={trashItem.label}
                                onClick={() => console.log(`Clicked ${trashItem.id}`)}
                            />
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    aria-label="Close sidebar"
                />
            )}
        </>
    );
}

export default SideBar;
