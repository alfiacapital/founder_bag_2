import React, {useEffect, useState} from "react";
import { FiPlus } from "react-icons/fi";
import SpaceForm from "../components/space/SpaceForm.jsx";
import {useUserContext} from "../context/UserProvider.jsx";
import {axiosClient} from "../api/axios.jsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {FaEllipsisVertical} from "react-icons/fa6";
import Menu from "../components/Menu.jsx";
import {MdDone, MdOpenInFull} from "react-icons/md";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import DeleteModal from "../components/DeleteModal.jsx";

function Home() {
    const {user} = useUserContext()
    const { data: spaces = [], isLoading: isLoadingSpaces, isError } = useQuery({
        queryKey: ["spaces"],
        queryFn: async () => await axiosClient.get(`/space/${user._id}`),
        select: res => res.data,

    });
    const navigate = useNavigate()
    const hasSpaces = spaces.length > 0;
    const [createSpaceForm, setCreateSpaceForm] = useState(false)
    const [deleteSpaceForm, setDeleteSpaceForm] = useState(null)
    const [editSpaceForm, setEditSpaceForm] = useState(null)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (isError) {
            toast.error("Server Error!");
        }
    }, [isError]);

    const deleteSpace = async (space) => {
        try {
            if (!space || !space?._id) return;
            await axiosClient.delete(`/space/${space._id}`)
            await queryClient.invalidateQueries("spaces")
        } catch (e) {
            console.error(e)
            toast.error(e.message || "Server Error!");
        } finally {
            setDeleteSpaceForm(null)
        }
    }

    return (
        <>
            {/* Greeting + Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold">
                        Good Afternoon, STARTUP FOUNDER
                    </h2>
                    <p className="text-dark-text2 text-sm">
                        Ready to Alfia System through your afternoon?
                    </p>
                </div>
            </div>

            <h1 className="text-md font-medium mb-4 mt-6">Your Spaces</h1>

            {!hasSpaces || isLoadingSpaces ? (
                // Empty state
                <div className="flex flex-col items-center justify-center py-20 relative">
                    {/* Cards row */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="hidden xl:flex bg-dark-bg2 border-2 border-dark-stroke rounded-default p-6 h-[150px] w-[15rem]" />
                        <div className="hidden md:flex bg-dark-bg2 border-2 border-dark-stroke rounded-default p-6 h-[150px] w-[15rem]" />
                        <div className="bg-dark-bg2 border-2 border-dark-stroke rounded-default p-6 h-[150px] w-[15rem]" />
                    </div>

                    {/* Top shadow gradient */}
                    <div className="absolute bottom-20 left-0 right-0 h-[100px] bg-gradient-to-t from-black to-transparent pointer-events-none" />

                    {/* Text + Button */}
                    <div className="absolute bottom-14 flex flex-col items-center justify-center px-4 text-center">
                        <p className="text-base sm:text-lg font-medium text-dark-text2">
                            Create your first space to get started 🚀
                        </p>
                        <button onClick={() => setCreateSpaceForm(!createSpaceForm)} className="flex items-center space-x-2 mt-4 px-6 py-2 border text-white border-[#444444] hover:bg-dark-hover rounded-full font-medium cursor-pointer">
                            <FiPlus className="text-xl" />
                            <span className="mt-1">CREATE SPACE</span>
                        </button>
                    </div>
                </div>

            ) : (
                // Spaces grid
                <>
                    {/* Spaces grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {spaces.map((space, key) => {
                            const tasks = Array.isArray(space.tasks) ? space.tasks : [];
                            const hasTasks = tasks.length > 0;

                            return (
                                <div
                                    key={key}
                                    className="group bg-dark-bg2 border border-dark-stroke rounded-default py-6 px-5 h-[280px]
                   hover:text-white hover:border-dark-stroke hover:bg-dark-hover
                   transition-all duration-300 flex flex-col relative overflow-hidden"
                                >
                                    {/* Card header */}
                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <img
                                                src={space?.image || "/icon.png"}
                                                className="h-8 w-8 rounded-button border border-[#444444] object-cover"
                                                alt={space?.name}
                                            />
                                            <span className="text-lg font-medium truncate pr-1">{space?.name}</span>
                                        </div>

                                        <Menu
                                            button={
                                                <button className="p-2 rounded-button border border-dark-stroke hover:bg-dark-hover cursor-pointer text-dark-text2 hover:text-white">
                                                    <FaEllipsisVertical />
                                                </button>
                                            }
                                            items={[
                                                { label: "Edit", onClick: () => setEditSpaceForm(space) },
                                                { label: "Delete", danger: true, onClick: () => setDeleteSpaceForm(space) },
                                            ]}
                                        />
                                    </div>

                                    {/* Tasks */}
                                    {hasTasks ? (
                                        <div className="flex flex-col space-y-2 mt-4 flex-1 overflow-hidden">
                                            {tasks.slice(0,4).map((task, idx) => (
                                                <div
                                                    key={task._id || idx}
                                                    className="w-full rounded-button border border-dark-stroke py-2 pt-3 px-4
                           text-dark-text2 flex justify-between items-center truncate"
                                                >
                                                    <div className="truncate max-w-[6rem]">{task?.title || "Untitled Task"}</div>
                                                    <div>{task?.estimatedDate || "hh:mm"}</div>
                                                </div>
                                            ))}

                                            {/* Bottom shadow only if more than 3 tasks */}
                                            {tasks.length > 3 && (
                                                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                                            )}
                                        </div>
                                    ) : (
                                        // Empty state
                                        <div className="flex flex-col items-center justify-center flex-1 text-center space-y-3">
                                            <div className="border border-[#444444] p-2 rounded-full">
                                                <MdDone className="text-dark-text2 text-md" />
                                            </div>
                                            <p className="text-dark-text2 font-medium text-sm">ALL CLEAR</p>
                                        </div>
                                    )}

                                    {/* Hover footer button */}
                                    <div onClick={() => navigate(`/space/${space?._id}/board`)}
                                        className="
                                        absolute bottom-20 md:bottom-6 left-1/2 -translate-x-1/2
                                        flex justify-center items-center space-x-2 w-fit px-6 py-2 rounded-full
                                        border border-dark-stroke text-dark-text2 bg-dark-bg2 cursor-pointer
                                        opacity-100 md:opacity-0 translate-y-6
                                        group-hover:opacity-100 group-hover:translate-y-0
                                        transition-all duration-300 hover:border-dark-stroke hover:bg-dark-hover hover:text-white
                                      "
                                    >
                                        <MdOpenInFull />
                                        <span  className="font-medium pt-1">
                                            OPEN
                                          </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* "Create Space" Card */}
                        <div
                            onClick={() => setCreateSpaceForm(!createSpaceForm)}
                            className="border-2 border-dashed border-dark-stroke rounded-default hover:border-dark-stroke text-dark-text2 hover:text-white flex flex-col items-center justify-center h-[280px] cursor-pointer transition-all duration-300"
                        >
                            <span className="text-2xl mb-2">+</span>
                            <p className="font-medium text-gradient">CREATE SPACE</p>
                        </div>
                    </div>

                </>
            )}
            {createSpaceForm && <SpaceForm open={createSpaceForm} onClose={() => setCreateSpaceForm(!createSpaceForm)} mode={"create"} /> }
            {editSpaceForm && <SpaceForm open={!!editSpaceForm} onClose={() => setEditSpaceForm(null)} initialData={editSpaceForm} mode={"edit"} /> }
            {deleteSpaceForm &&  <DeleteModal
                isOpen={!!deleteSpaceForm} title="Delete Space"
                message="Are you sure you want to delete this Space? This action cannot be undone."
                onClick={() => deleteSpace(deleteSpaceForm)}
                onClose={() => setDeleteSpaceForm(null)}
            />}
        </>
    );
}

export default Home;
