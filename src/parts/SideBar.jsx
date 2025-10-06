import React, {useState, useEffect} from 'react';
import {FaPlus, FaRegCalendarCheck, FaTimes} from "react-icons/fa";
import {GoPlus, GoSearch} from "react-icons/go";
import { LiaHomeSolid } from "react-icons/lia";
import { FiPlus } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import SpaceForm from "../components/space/SpaceForm.jsx";
import DeleteModal from "../components/DeleteModal.jsx";
import SearchModal from "../components/SearchModal.jsx";
import {useNavigate, useLocation} from "react-router-dom";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosClient} from "@/api/axios.jsx";
import {SiGoogledocs} from "react-icons/si";


function SideBar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryClient = useQueryClient()
    const [createSpaceForm, setCreateSpaceForm] = useState(false)
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, note: null })
    const [searchModalOpen, setSearchModalOpen] = useState(false)
    
    // Keyboard shortcut for search (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchModalOpen(prev => !prev);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const mainMenuItems = [
        { image: "/alfia-ai.png", label: "Alfia AI", id: "alfia-ai", active: false, onClick: () => navigate("/alfia-ai") },
        { icon: FaRegCalendarCheck , label: "Calendar", id: "calendar", active: false, onClick: () => navigate("/calendar") },
    ];
    const { data: notes = [] } = useQuery({
        queryKey: ["notes"],
        queryFn: async () => {
            const res = await axiosClient.get('/notes')
            return res.data.notes;
        },
    });

    // Query to get trashed notes count
    const { data: trashCounts = 0 } = useQuery({
        queryKey: ["notes-trash-counts"],
        queryFn: async () => {
            const res = await axiosClient.get('/notes/trash-counts');
            return res.data.count || 0;
        },
    });

    // Query to get trashed notes count
    const { data: spaceTrashCounts = 0 } = useQuery({
        queryKey: ["space-trash-counts"],
        queryFn: async () => {
            const res = await axiosClient.get('/space/inactive/counts');
            return res.data.count || 0;
        },
    });
    // Delete note handlers
    const handleDeleteNote = (note) => {
        setDeleteModal({ isOpen: true, note });
    };

    const confirmDeleteNote = () => {
        if (deleteModal.note) {
            const note = deleteModal.note;
            const isActive = location.pathname === `/note/${note._id}`;

            axiosClient.delete(`/notes/${note._id}`)
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ["notes"] });
                    queryClient.invalidateQueries({ queryKey: ["trashed-notes"] });
                    queryClient.invalidateQueries({ queryKey: ["notes-trash-counts"] });
                    // If we're currently viewing this note, navigate away
                    if (isActive) {
                        navigate('/');
                    }
                })
                .catch(error => {
                    console.error('Error deleting note:', error);
                });
        }
        setDeleteModal({ isOpen: false, note: null });
    };

    const cancelDeleteNote = () => {
        setDeleteModal({ isOpen: false, note: null });
    };

    // Menu item component for reusability
    const MenuItem = ({ icon: Icon, image, label, onClick, className = "", active  }) => (
        <div
            className={`flex items-center gap-2 p-1 px-4 rounded-button hover:bg-dark-hover text-dark-text2 hover:text-dark-text2 cursor-pointer transition-all duration-300 ease-in-out ${active ? "bg-dark-active text-dark-text2" : "text-dark-text2"} ${className}`}
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
            <span className={`text-sm  font-bold pt-1  transition-all duration-300 ease-in-out ${active ? "text-dark-text2" : "text-dark-text2"}`}>{label}</span>
        </div>
    );

    return (
        <>
            {/* Sidebar - Hidden completely on large screens when closed */}
            <aside
                className={`
                    fixed xl:static inset-y-0 left-0 z-40 bg-dark-bg xl:py-6 px-6 xl:px-8
                    transform transition-all duration-300 ease-in-out
                    flex flex-col h-screen xl:h-full xl:my-0
                    shadow-xl xl:shadow-none xl:ml-0 
                    ${sidebarOpen 
                        ? "w-72 sm:w-80 md:w-72 xl:w-[330px] translate-x-0 py-6" 
                        : "w-72 sm:w-80 md:w-72 -translate-x-full xl:hidden xl:w-0"
                    }
                `}
            >


                {/* Header - Mobile close button */}
                <div className="flex justify-between items-center xl:hidden mb-6">
                    <h1 className="text-lg font-bold text-dark-text2">ALFIA SYSTEM</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 hover:bg-dark-hover rounded-button transition-all duration-300 "
                        aria-label="Close sidebar"
                    >
                        <FaTimes className="text-xl text-dark-text2" />
                    </button>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 bg-dark-bg2 p-4 rounded-default mb-4 xl:mb-5 border border-dark-stroke overflow-y-auto sidebar-nav-scroll flex flex-col">
                    <div className="space-y-[1px] flex-1">
                        {/* Main menu items */}
                        <MenuItem
                            icon={GoSearch}
                            label={"Search"}
                            active={false}
                            onClick={() => setSearchModalOpen(true)}
                        />
                        <MenuItem
                            icon={LiaHomeSolid}
                            label={"Home"}
                            active={location.pathname === "/v2"}
                            onClick={() => navigate("/v2")}
                        />
                        {mainMenuItems.map((item) => (
                            <MenuItem
                                key={item.id}
                                icon={item.icon}
                                image={item.image}
                                label={item.label}
                                active={false}
                                onClick={() => item.onClick()}
                            />
                        ))}
                        <MenuItem
                            icon={SiGoogledocs}
                            label={"Docs"}
                            active={location.pathname === "/notes"}
                            onClick={() => navigate("/notes")}
                        />

                        {/* Private section */}
                        <div className="mt-6">
                            <div className={"flex items-center justify-between"}>
                                <p className="text-[13px] font-bold text-dark-text2 px-4 pt-1 ">Private</p>
                                <GoPlus className={"text-dark-text2 h-5 w-5 hover:text-dark-text2 transition-all duration-300 ease-in-out cursor-pointer "} onClick={async () => {
                                    await axiosClient.post('/notes', {
                                        title: 'New Note',
                                    }).then(response => {
                                        queryClient.invalidateQueries({ queryKey: ["notes"] });
                                        navigate(`/note/${response.data._id}`);
                                    }).catch(error => {
                                        console.error('Error creating note:', error);
                                    });
                                }}/>
                            </div>
                            {notes.length === 0 && (
                                <MenuItem
                                    icon={FiPlus}
                                    label="Add new"
                                    onClick={() => {
                                        axiosClient.post('/notes', {
                                            title: 'New Note',
                                        }).then(response => {
                                            queryClient.invalidateQueries({ queryKey: ["notes"] });
                                            navigate(`/note/${response.data._id}`);
                                        }).catch(error => {
                                            console.error('Error creating note:', error);
                                        });
                                    }}
                                />
                            )}
                            {notes?.slice(0,3)?.filter(note => !note?.sharedWith?.length)?.map((note, key) => {
                                const isActive = location.pathname === `/note/${note._id}`;
                                return (
                                    <div className={"ml-7"} key={key}>
                                        <div
                                            className={`flex items-center justify-between my-1 p-1 px-4 rounded-button hover:bg-dark-hover text-dark-text2 hover:text-dark-text2 cursor-pointer group transition-all duration-300 ease-in-out ${
                                                isActive ? 'bg-dark-active text-dark-text2' : ''
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
                                            <span className={`text-sm font-bold pt-1 transition-all duration-300 truncate ease-in-out ${
                                                isActive ? 'text-dark-text2' : 'text-dark-text2'
                                            }`}>{note?.title}</span>
                                            <button
                                                className={`p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 text-dark-text2 hover:text-dark-text2 cursor-pointer transition-all duration-300 ease-in-out ${
                                                    isActive ? 'text-dark-text2 hover:text-dark-text2' : 'text-dark-text2 hover:text-dark-text2'
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteNote(note);
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
                            {notes?.length > 3 && (
                                <div className={"ml-7"} >
                                    <div
                                        className={`flex items-center justify-between my-1 p-1 px-4 rounded-button hover:bg-dark-hover  cursor-pointer group transition-all duration-300 ease-in-out text-dark-text2 `}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => navigate("/notes")}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                navigate("/notes")
                                            }
                                        }}
                                    >
                                            <span className={`text-sm font-bold pt-1 transition-all duration-300 ease-in-out `}>Show All ...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Shared section */}
                        <div className="mt-4">
                            <p className="text-[13px] font-bold text-dark-text2  mb-2 px-4">Shared</p>
                            {notes?.slice(0,3)?.filter(note => note?.sharedWith?.length > 0)?.map((note, key) => {
                                const isActive = location.pathname === `/note/${note._id}`;
                                return (
                                    <div className={"ml-7"} key={key}>
                                        <div
                                            className={`flex items-center justify-between my-1 p-1 px-4 rounded-button hover:bg-dark-hover text-dark-text2 hover:text-dark-text2 cursor-pointer group transition-all duration-300 ease-in-out ${
                                                isActive ? 'bg-dark-active text-dark-text2' : ''
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
                                            <span className={`text-sm font-bold pt-1 transition-all truncate duration-300 ease-in-out ${
                                                isActive ? 'text-dark-text2' : 'text-dark-text2'
                                            }`}>{note?.title}</span>
                                            <button
                                                className={`p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 text-dark-text2 hover:text-dark-text2 cursor-pointer transition-all duration-300 ease-in-out ${
                                                    isActive ? 'text-dark-text2 hover:text-dark-text2' : 'text-dark-text2 hover:text-dark-text2'
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteNote(note);
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
                            {notes?.length > 3 && (
                                <div className={"ml-7"} >
                                    <div
                                        className={`flex items-center justify-between my-1 p-1 px-4 rounded-button hover:bg-dark-hover  cursor-pointer group transition-all duration-300 ease-in-out text-dark-text2 `}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => navigate("/notes")}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                navigate("/notes")
                                            }
                                        }}
                                    >
                                        <span className={`text-sm font-bold pt-1 transition-all duration-300 ease-in-out `}>Show All ...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trash - positioned at bottom */}
                    <div className="mt-auto pt-4 ">
                        <div
                            className={`flex items-center justify-between gap-2 p-1 px-4 rounded-button hover:bg-dark-hover text-dark-text2 hover:text-dark-text2 cursor-pointer transition-all duration-300 ease-in-out ${
                                location.pathname === "/trashed-notes" ? "bg-dark-active text-dark-text2" : "text-dark-text2"
                            }`}
                            onClick={() => navigate("/trashed-notes")}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    navigate("/trashed-notes");
                                }
                            }}
                        >
                            <div className='flex items-center gap-2'>
                                <IoTrashOutline className="text-xl text-dark-text2 transition-all duration-300 ease-in-out" />
                                <span className={`text-sm font-bold pt-1 transition-all duration-300 ease-in-out ${
                                    location.pathname === "/trashed-notes" ? "text-dark-text2" : "text-dark-text2"
                                }`}>
                                    Trash
                                </span>
                            </div>
                            {trashCounts > 0 && (
                                <span className="ml-2 border border-dark-stroke bg-dark-hover text-dark-text2 text-xs font-bold px-2 pt-1 rounded-full">
                                    {trashCounts}
                                </span>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Lists Section */}
                <div className="bg-dark-active  p-4 rounded-default  border border-dark-stroke ">
                    <div className="space-y-1">
                        <div onClick={() => setCreateSpaceForm(!createSpaceForm)}
                            className={`flex items-center gap-1 p-1 px-4 rounded-button bg-dark-active text-dark-text2 hover:bg-dark-hover hover:text-dark-text2   cursor-pointer transition-all duration-300 ease-in-out `}
                            role="button"
                            tabIndex={0}
                        >
                            <FiPlus className={"text-xl  font-bold   transition-all duration-300 ease-in-out"}/>
                            <span className={`text-sm  font-bold pt-1  transition-all duration-300 ease-in-out `}>Create new space</span>
                        </div>
                        <div onClick={() => navigate("/")}
                            className={`flex items-center gap-2 p-1 px-4 rounded-button bg-dark-active text-dark-text2 hover:bg-dark-hover hover:text-dark-text2   cursor-pointer transition-all duration-300 ease-in-out `}
                            role="button"
                            tabIndex={0}
                        >
                            <span className={`text-sm  font-bold pt-1  transition-all duration-300 ease-in-out `}>All my spaces</span>
                        </div>
                        <div
                            className={`flex justify-between items-center gap-2 p-1 px-4 rounded-button bg-dark-active text-dark-text2 hover:bg-dark-hover hover:text-dark-text2  cursor-pointer transition-all duration-300 ease-in-out `}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate("/archived-spaces")}
                        >
                            <span className={`text-sm  font-bold pt-1  transition-all duration-300 ease-in-out `}>Archived spaces</span>
                            {spaceTrashCounts > 0 && (
                                <span className={`border border-dark-stroke bg-dark-hover text-dark-text2 text-xs font-bold px-2 pt-1 rounded-full `}>{spaceTrashCounts}</span>
                            )}
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
            <DeleteModal
                isOpen={deleteModal.isOpen}
                title="Trash Note"
                message={`Are you sure you want to trash "${deleteModal.note?.title}"?.`}
                onClick={confirmDeleteNote}
                onClose={cancelDeleteNote}
                buttonMessage="Trash"
            />
            <SearchModal 
                isOpen={searchModalOpen} 
                onClose={() => setSearchModalOpen(false)} 
            />
        </>
    );
}

export default SideBar;
