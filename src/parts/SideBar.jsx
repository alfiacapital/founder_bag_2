import React, {useState} from 'react';
import { FaRegCalendarCheck, FaTimes } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { LiaHomeSolid } from "react-icons/lia";
import { FiPlus } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import SpaceForm from "../components/space/SpaceForm.jsx";
import {useNavigate, useLocation} from "react-router-dom";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosClient} from "@/api/axios.jsx";


function SideBar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryClient = useQueryClient()
    const [createSpaceForm, setCreateSpaceForm] = useState(false)
    const mainMenuItems = [
        { icon: GoSearch, label: "Search", id: "search", active: false },
        { icon: LiaHomeSolid , label: "Home", id: "home", active: true },
        { image: "/alfia-ai.png", label: "Alfia AI", id: "alfia-ai", active: false },
        { icon: FaRegCalendarCheck , label: "Calendar", id: "calendar", active: false }
    ];
    const { data: notes = [] } = useQuery({
        queryKey: ["notes"],
        queryFn: async () => {
            const res = await axiosClient.get('/notes')
            return res.data;
        },
    });



    const trashItem = { icon: IoTrashOutline , label: "Trash", id: "trash", active: false };

    // Menu item component for reusability
    const MenuItem = ({ icon: Icon, image, label, onClick, className = "", active  }) => (
        <div
            className={`flex items-center gap-2 p-1 px-4 rounded-button hover:bg-[#1f1f1f] text-dark-text2 hover:text-white cursor-pointer transition-all duration-300 ease-in-out ${active ? "bg-white text-white" : "text-dark-text2"} ${className}`}
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
            {Icon && <Icon className="text-xl text-dark-text2  transition-all duration-300 ease-in-out" />}
            {image && <img src={image} alt={label} className="h-5 w-5" />}
            <span className={`text-sm  font-bold pt-1  transition-all duration-300 ease-in-out ${active ? "text-white" : "text-dark-text2"}`}>{label}</span>
        </div>
    );

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
                    fixed xl:static inset-y-0 left-0 z-40 
                    w-72 sm:w-80 md:w-72 xl:w-[330px]
                    bg-black xl:py-6 px-6 xl:px-8
                    transform transition-all duration-300 ease-in-out <<
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
                        className="p-2 hover:bg-gray-800 rounded-button transition-all duration-300 "
                        aria-label="Close sidebar"
                    >
                        <FaTimes className="text-xl text-white" />
                    </button>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 bg-dark-bg2 p-4 rounded-default mb-4 xl:mb-5 border border-[#444444] overflow-y-auto sidebar-nav-scroll flex flex-col">
                    <div className="space-y-[1px] flex-1">
                        {/* Main menu items */}
                        {mainMenuItems.map((item) => (
                            <MenuItem
                                key={item.id}
                                icon={item.icon}
                                image={item.image}
                                label={item.label}
                                active={false}
                                onClick={() => console.log(`Clicked ${item.id}`)}
                            />
                        ))}

                        {/* Private section */}
                        <div className="mt-6">
                            <p className="text-sm font-bold text-dark-text2 px-4 mt-2">Private</p>
                            <MenuItem
                                icon={FiPlus}
                                label="Add new"
                                onClick={() => {
                                    // Create new note
                                    axiosClient.post('/notes', {
                                        title: 'New Note',
                                        description: ''
                                    }).then(response => {
                                        // Invalidate notes query to refresh the sidebar
                                        queryClient.invalidateQueries({ queryKey: ["notes"] });
                                        navigate(`/note/${response.data._id}`);
                                    }).catch(error => {
                                        console.error('Error creating note:', error);
                                    });
                                }}
                            />
                            {notes?.map((note, key) => {
                                const isActive = location.pathname === `/note/${note._id}`;
                                return (
                                    <div className={"ml-7"} key={key}>
                                        <div
                                            className={`flex items-center justify-between my-1 p-1 px-4 rounded-button hover:bg-[#1f1f1f] text-dark-text2 hover:text-white cursor-pointer group transition-all duration-300 ease-in-out ${
                                                isActive ? 'bg-[#181818] text-white' : ''
                                            }`}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => navigate(`/note/${note._id}`)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    navigate(`/note/${note._id}`);
                                                }
                                            }}
                                        >
                                            <span className={`text-sm font-bold pt-1 transition-all duration-300 ease-in-out ${
                                                isActive ? 'text-white' : 'text-dark-text2'
                                            }`}>{note?.title}</span>
                                            <button
                                                className={`p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 text-dark-text2 hover:text-white cursor-pointer transition-all duration-300 ease-in-out ${
                                                    isActive ? 'text-white hover:text-white' : 'text-dark-text2 hover:text-white'
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Are you sure you want to delete this note?')) {
                                                        axiosClient.delete(`/notes/${note._id}`)
                                                            .then(() => {
                                                                queryClient.invalidateQueries({ queryKey: ["notes"] });
                                                                // If we're currently viewing this note, navigate away
                                                                if (isActive) {
                                                                    navigate('/');
                                                                }
                                                            })
                                                            .catch(error => {
                                                                console.error('Error deleting note:', error);
                                                            });
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }
                                                }}
                                            >
                                                <MdDeleteOutline className="" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Shared section */}
                        <div className="mt-4">
                            <p className="text-sm font-bold text-dark-text2  mb-2 px-4">Shared</p>
                            {/* <MenuItem
                                icon={FiPlus}
                                label="Add new"
                                onClick={() => console.log('Add shared note')}
                            /> */}
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

                {/* Lists Section */}
                <div className="bg-dark-active  p-4 rounded-default  border border-dark-stroke ">
                    <div className="space-y-1">
                        <div onClick={() => setCreateSpaceForm(!createSpaceForm)}
                            className={`flex items-center gap-1 p-1 px-4 rounded-button bg-dark-active text-dark-text2 hover:bg-[#444444] hover:text-white   cursor-pointer transition-all duration-300 ease-in-out `}
                            role="button"
                            tabIndex={0}
                        >
                            <FiPlus className={"text-xl  font-bold   transition-all duration-300 ease-in-out"}/>
                            <span className={`text-sm  font-bold pt-1  transition-all duration-300 ease-in-out `}>Create new space</span>
                        </div>
                        <div onClick={() => navigate("/")}
                            className={`flex items-center gap-2 p-1 px-4 rounded-button bg-dark-active text-dark-text2 hover:bg-[#444444] hover:text-white   cursor-pointer transition-all duration-300 ease-in-out `}
                            role="button"
                            tabIndex={0}
                        >
                            <span className={`text-sm  font-bold pt-1  transition-all duration-300 ease-in-out `}>All my spaces</span>
                        </div>
                        <div
                            className={`flex items-center gap-2 p-1 px-4 rounded-button bg-dark-active text-dark-text2 hover:bg-[#444444] hover:text-white  cursor-pointer transition-all duration-300 ease-in-out `}
                            role="button"
                            tabIndex={0}
                        >
                            <span className={`text-sm  font-bold pt-1  transition-all duration-300 ease-in-out `}>Archived spaces</span>
                        </div>


                    </div>
                </div>

            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 xl:hidden backdrop-blur-sm"
                    aria-label="Close sidebar"
                />
            )}
            {createSpaceForm && <SpaceForm open={createSpaceForm} onClose={() => setCreateSpaceForm(!createSpaceForm)} mode={"create"} /> }
        </>
    );
}

export default SideBar;
