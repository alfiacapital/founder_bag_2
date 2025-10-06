import React, {useEffect, useState} from "react";
import { FiPlus, FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle, FiTarget } from "react-icons/fi";
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Home() {
    const {user} = useUserContext()
    const { data: spaces = [], isLoading: isLoadingSpaces, isError } = useQuery({
        queryKey: ["spaces"],
        queryFn: async () => await axiosClient.get(`/space/${user._id}`),
        select: res => res.data,

    });

    // Dashboard stats query
    const { data: dashboardStats, isLoading: isLoadingStats, isError: isStatsError } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => await axiosClient.get("/dashboard/stats"),
        select: res => res.data,
        enabled: !!user?._id, // Only fetch when user is available
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
        if (isStatsError) {
            toast.error("Failed to load dashboard statistics!");
        }
    }, [isError, isStatsError]);

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
                    <h2 className="text-2xl text-dark-text1 font-semibold capitalize">
                        Good Afternoon, {user?.full_name}
                    </h2>
                    <p className="text-dark-text2 text-sm">
                        Ready to Alfia System through your afternoon?
                    </p>
                </div>
            </div>

            {/* Dashboard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {/* Total Tasks Card */}
                <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-dark-text2 text-sm font-medium">Total Tasks</p>
                            <p className="text-2xl font-bold text-dark-text1 mt-1">
                                {isLoadingStats ? "..." : dashboardStats?.totalTasks?.total || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-600/20 rounded-button">
                            <FiTarget className="text-blue-500 text-xl" />
                        </div>
                    </div>
                    <div className="flex items-center mt-3">
                        {dashboardStats?.totalTasks?.trend === 'up' ? (
                            <FiTrendingUp className="text-green-500 text-sm mr-1" />
                        ) : (
                            <FiTrendingDown className="text-red-500 text-sm mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                            dashboardStats?.totalTasks?.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }`}>
                            {dashboardStats?.totalTasks?.change > 0 ? '+' : ''}{dashboardStats?.totalTasks?.change || 0}%
                        </span>
                        <span className="text-dark-text2 text-sm ml-1">from last week</span>
                    </div>
                </div>

                {/* Completed Tasks Card */}
                <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-dark-text2 text-sm font-medium">Completed</p>
                            <p className="text-2xl font-bold text-dark-text1 mt-1">
                                {isLoadingStats ? "..." : dashboardStats?.completedTasks?.total || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-green-600/20 rounded-button">
                            <FiCheckCircle className="text-green-500 text-xl" />
                        </div>
                    </div>
                    <div className="flex items-center mt-3">
                        {dashboardStats?.completedTasks?.trend === 'up' ? (
                            <FiTrendingUp className="text-green-500 text-sm mr-1" />
                        ) : (
                            <FiTrendingDown className="text-red-500 text-sm mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                            dashboardStats?.completedTasks?.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }`}>
                            {dashboardStats?.completedTasks?.change > 0 ? '+' : ''}{dashboardStats?.completedTasks?.change || 0}%
                        </span>
                        <span className="text-dark-text2 text-sm ml-1">from last week</span>
                    </div>
                </div>

                {/* In Progress Tasks Card */}
                <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-dark-text2 text-sm font-medium">In Progress</p>
                            <p className="text-2xl font-bold text-dark-text1 mt-1">
                                {isLoadingStats ? "..." : dashboardStats?.inProgressTasks?.total || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-600/20 rounded-button">
                            <FiClock className="text-yellow-500 text-xl" />
                        </div>
                    </div>
                    <div className="flex items-center mt-3">
                        {dashboardStats?.inProgressTasks?.trend === 'up' ? (
                            <FiTrendingUp className="text-yellow-500 text-sm mr-1" />
                        ) : (
                            <FiTrendingDown className="text-red-500 text-sm mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                            dashboardStats?.inProgressTasks?.trend === 'up' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                            {dashboardStats?.inProgressTasks?.change > 0 ? '+' : ''}{dashboardStats?.inProgressTasks?.change || 0}%
                        </span>
                        <span className="text-dark-text2 text-sm ml-1">from last week</span>
                    </div>
                </div>

                {/* Productivity Card */}
                <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-dark-text2 text-sm font-medium">Productivity</p>
                            <p className="text-2xl font-bold text-dark-text1 mt-1">
                                {isLoadingStats ? "..." : `${dashboardStats?.productivity?.productivity || 0}%`}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-600/20 rounded-button">
                            <FiTrendingUp className="text-purple-500 text-xl" />
                        </div>
                    </div>
                    <div className="flex items-center mt-3">
                        {dashboardStats?.productivity?.trend === 'up' ? (
                            <FiTrendingUp className="text-purple-500 text-sm mr-1" />
                        ) : (
                            <FiTrendingDown className="text-red-500 text-sm mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                            dashboardStats?.productivity?.trend === 'up' ? 'text-purple-500' : 'text-red-500'
                        }`}>
                            {dashboardStats?.productivity?.change > 0 ? '+' : ''}{dashboardStats?.productivity?.change || 0}%
                        </span>
                        <span className="text-dark-text2 text-sm ml-1">from last week</span>
                    </div>
                </div>
            </div>

            {/* Weekly Trend */}
            {/* <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Productivity Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={weeklyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F9FAFB'
                            }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="productivity" 
                            stroke="#8B5CF6" 
                            strokeWidth={3}
                            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div> */}

            <h1 className="text-md font-medium mb-4 mt-8">Your Spaces</h1>

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
                    <div 
                        className="absolute bottom-20 left-0 right-0 h-[100px] pointer-events-none" 
                        style={{
                            background: 'linear-gradient(to top, var(--color-bg) 0%, transparent 100%)'
                        }}
                    />

                    {/* Text + Button */}
                    <div className="absolute bottom-14 flex flex-col items-center justify-center px-4 text-center">
                        <p className="text-base sm:text-lg font-medium text-dark-text2">
                            Create your first space to get started 🚀
                        </p>
                        <button onClick={() => setCreateSpaceForm(!createSpaceForm)} className="flex items-center space-x-2 mt-4 px-6 py-2 border text-dark-text1 border-dark-stroke hover:bg-dark-hover rounded-full font-medium cursor-pointer">
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
                   hover:text-dark-text1 hover:border-dark-stroke hover:bg-dark-hover
                   transition-all duration-300 flex flex-col relative overflow-hidden"
                                >
                                    {/* Card header */}
                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <img
                                                src={space?.image || "/icon.png"}
                                                className="h-8 w-8 rounded-button border border-dark-stroke object-cover"
                                                alt={space?.name}
                                            />
                                            <span className="text-lg text-dark-text1 font-medium truncate pr-1">{space?.name}</span>
                                        </div>

                                        <Menu
                                            button={
                                                <button className="p-2 rounded-button border border-dark-stroke hover:bg-dark-hover cursor-pointer text-dark-text2 hover:text-dark-text1">
                                                    <FaEllipsisVertical />
                                                </button>
                                            }
                                            items={[
                                                { label: "Edit", onClick: () => setEditSpaceForm(space) },
                                                { label: "Archive", onClick: () => setDeleteSpaceForm(space) },
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
                                                <div 
                                                    className="absolute bottom-0 left-0 w-full h-16 pointer-events-none" 
                                                    style={{
                                                        background: 'linear-gradient(to top, var(--color-bg2) 0%, transparent 100%)'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        // Empty state
                                        <div className="flex flex-col items-center justify-center flex-1 text-center space-y-3">
                                            <div className="border border-dark-stroke p-2 rounded-full">
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
                                        transition-all duration-300 hover:border-dark-stroke hover:bg-dark-hover hover:text-dark-text1
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
                            className="border-2 border-dashed border-dark-stroke rounded-default hover:border-dark-stroke text-dark-text2 hover:text-dark-text1 flex flex-col items-center justify-center h-[280px] cursor-pointer transition-all duration-300"
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
                isOpen={!!deleteSpaceForm} title="Archive Space"
                message="Are you sure you want to archive this Space? Archived spaces will be hidden from your workspace but can be restored later. This action will not delete any data."
                onClick={() => deleteSpace(deleteSpaceForm)}
                onClose={() => setDeleteSpaceForm(null)}
                buttonMessage="Archive"
            />}
        </>
    );
}

export default Home;
