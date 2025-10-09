import React, {useEffect, useState} from "react";
import { FiPlus, FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle, FiTarget, FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
import ShareSpaceModal from "../components/ShareSpaceModal.jsx";
import ManageSharedSpaceUsers from "../components/space/ManageSharedSpaceUsers.jsx";
import { useTranslation } from "react-i18next";

function Home() {
    const {user} = useUserContext()
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 11;
    const { t } = useTranslation("global");
    
    const { data: spacesResponse, isLoading: isLoadingSpaces, isError } = useQuery({
        queryKey: ["spaces", currentPage, itemsPerPage],
        queryFn: async () => await axiosClient.get(`/space/${user._id}?page=${currentPage}&limit=${itemsPerPage}`),
        select: res => res,
        keepPreviousData: true,
    });

    const spaces = spacesResponse?.data?.data || [];
    const pagination = spacesResponse?.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: itemsPerPage,
        hasNextPage: false,
        hasPreviousPage: false
    };

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
    const [shareSpaceForm, setShareSpaceForm] = useState(null)
    const [manageSpaceForm, setManageSpaceForm] = useState(null)
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

    const shareSpace = async (email) => {
        try {
            if (!shareSpaceForm || !shareSpaceForm?._id || !email) return;
            await axiosClient.post(`/space/${shareSpaceForm._id}/invite`, { email });
            await queryClient.invalidateQueries("spaces")
            toast.success(t('invite-sent-successfully') || "Invitation sent successfully!");
            setShareSpaceForm(null);
        } catch (e) {
            console.error(e);
            toast.error(e.response?.data?.message || e.message || "Failed to send invitation!");
        }
    }


    return (
        <>
            {/* Greeting + Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl text-dark-text1 font-semibold capitalize">
                        {t('hello')}, {user?.full_name}
                    </h2>
                    <p className="text-dark-text2 text-sm">
                        {t('ready-to-use-alfia-system')}
                    </p>
                </div>
            </div>

            {/* Dashboard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {/* Total Tasks Card */}
                <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-dark-text2 text-sm font-medium">{t('total-tasks')}</p>
                            <p className="text-2xl font-bold text-dark-text1 mt-1">
                                {isLoadingStats ? "..." : dashboardStats?.totalTasks?.total || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-dark-active rounded-button">
                            <FiTarget className="text-dark-text1 text-xl" />
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
                        <span className="text-dark-text2 text-sm ml-1 rtl:mr-1">{t('from-last-week')}</span>
                    </div>
                </div>

                {/* Completed Tasks Card */}
                <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-dark-text2 text-sm font-medium">{t('completed')}</p>
                            <p className="text-2xl font-bold text-dark-text1 mt-1">
                                {isLoadingStats ? "..." : dashboardStats?.completedTasks?.total || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-dark-active rounded-button">
                            <FiCheckCircle className="text-dark-text1 text-xl" />
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
                        <span className="text-dark-text2 text-sm ml-1 rtl:mr-1">{t('from-last-week')}</span>
                    </div>
                </div>

                {/* In Progress Tasks Card */}
                <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-dark-text2 text-sm font-medium">{t('in-progress')}</p>
                            <p className="text-2xl font-bold text-dark-text1 mt-1">
                                {isLoadingStats ? "..." : dashboardStats?.inProgressTasks?.total || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-dark-active rounded-button">
                            <FiClock className="text-dark-text1 text-xl" />
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
                        <span className="text-dark-text2 text-sm ml-1 rtl:mr-1">{t('from-last-week')}</span>
                    </div>
                </div>

                {/* Productivity Card */}
                <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-dark-text2 text-sm font-medium">{t('productivity')}</p>
                            <p className="text-2xl font-bold text-dark-text1 mt-1">
                                {isLoadingStats ? "..." : `${dashboardStats?.productivity?.productivity || 0}%`}
                            </p>
                        </div>
                        <div className="p-3 bg-dark-active rounded-button">
                            <FiTrendingUp className="text-dark-text1 text-xl" />
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
                        <span className="text-dark-text2 text-sm ml-1 rtl:mr-1">{t('from-last-week')}</span>
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

            <h1 className="text-md text-dark-text1 font-medium mb-4 mt-8">{t('your-spaces')}</h1>

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
                            {t('create-first-space')}
                        </p>
                        <button onClick={() => setCreateSpaceForm(!createSpaceForm)} className="flex items-center gap-2 mt-4 px-6 py-2 border text-dark-text1 border-dark-stroke hover:bg-dark-hover rounded-full font-medium cursor-pointer">
                            <FiPlus className="text-xl" />
                            <span className="mt-1">{t('create-new-space')}</span>
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
                                        {space?.userId?._id === user?._id && (
                                            <Menu
                                            button={
                                                <button className="p-2 rounded-button border border-dark-stroke hover:bg-dark-hover cursor-pointer text-dark-text2 hover:text-dark-text1">
                                                    <FaEllipsisVertical />
                                                </button>
                                            }
                                            items={[
                                                { label: t('edit'), onClick: () => setEditSpaceForm(space) },
                                                { label: t('share'), onClick: () => setShareSpaceForm(space) },
                                                { label: t('manage'), onClick: () => setManageSpaceForm(space) },
                                                { label: t('archive'), onClick: () => setDeleteSpaceForm(space) },
                                            ]}
                                        />
                                        )}
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
                                        <span className="font-medium pt-1 uppercase">
                                            {t('open')}
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
                            <p className="font-medium text-gradient">{t('create-new-space')}</p>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 px-4 gap-4">
                            {/* Left side: Items info */}
                            <div className="text-sm text-dark-text2">
                                {t('showing')} <span className="text-dark-text1 font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> {t('to')}{" "}
                                <span className="text-dark-text1 font-medium">
                                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                                </span>{" "}
                                {t('of')} <span className="text-dark-text1 font-medium">{pagination.totalItems}</span> {t('spaces')}
                            </div>

                            {/* Right side: Navigation buttons */}
                            <div className="flex items-center gap-2">
                                {/* Previous button */}
                                <button
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    disabled={!pagination.hasPreviousPage}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-button border
                                        ${pagination.hasPreviousPage
                                            ? 'border-dark-stroke text-dark-text1 hover:bg-dark-hover cursor-pointer'
                                            : 'border-dark-stroke text-dark-text2 cursor-not-allowed opacity-50'
                                        }
                                        transition-all duration-200
                                    `}
                                >
                                    <FiChevronLeft className="text-lg rtl:rotate-180" />
                                    <span className="hidden sm:inline">{t('previous')}</span>
                                </button>

                                {/* Page numbers */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                                        // Show first page, last page, current page, and pages around current
                                        const showPage = 
                                            pageNum === 1 || 
                                            pageNum === pagination.totalPages || 
                                            (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1);
                                        
                                        const showEllipsis = 
                                            (pageNum === pagination.currentPage - 2 && pagination.currentPage > 3) ||
                                            (pageNum === pagination.currentPage + 2 && pagination.currentPage < pagination.totalPages - 2);

                                        if (showEllipsis) {
                                            return (
                                                <span key={pageNum} className="px-2 text-dark-text2">
                                                    ...
                                                </span>
                                            );
                                        }

                                        if (!showPage) return null;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`
                                                    w-10 h-10 rounded-button border transition-all duration-200
                                                    ${pageNum === pagination.currentPage
                                                        ? 'bg-dark-active border-dark-stroke text-dark-text1 font-semibold'
                                                        : 'border-dark-stroke text-dark-text2 hover:bg-dark-hover hover:text-dark-text1'
                                                    }
                                                `}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Next button */}
                                <button
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-button border
                                        ${pagination.hasNextPage
                                            ? 'border-dark-stroke text-dark-text1 hover:bg-dark-hover cursor-pointer'
                                            : 'border-dark-stroke text-dark-text2 cursor-not-allowed opacity-50'
                                        }
                                        transition-all duration-200
                                    `}
                                >
                                    <span className="hidden sm:inline">{t('next')}</span>
                                    <FiChevronRight className="text-lg rtl:rotate-180" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
            {createSpaceForm && <SpaceForm open={createSpaceForm} onClose={() => setCreateSpaceForm(!createSpaceForm)} mode={"create"} /> }
            {editSpaceForm && <SpaceForm open={!!editSpaceForm} onClose={() => setEditSpaceForm(null)} initialData={editSpaceForm} mode={"edit"} /> }
            {deleteSpaceForm &&  <DeleteModal
                isOpen={!!deleteSpaceForm} title={t('archive-space')}
                message={t('are-you-sure-archive-space')}
                onClick={() => deleteSpace(deleteSpaceForm)}
                onClose={() => setDeleteSpaceForm(null)}
                buttonMessage={t('archive')}
            />}
            {shareSpaceForm && <ShareSpaceModal
                isOpen={!!shareSpaceForm}
                space={shareSpaceForm}
                onShare={shareSpace}
                onClose={() => setShareSpaceForm(null)}
            />}
            {manageSpaceForm && <ManageSharedSpaceUsers
                isOpen={!!manageSpaceForm}
                spaceId={manageSpaceForm._id}
                sharedUsers={manageSpaceForm.invited || []}
                onClose={() => setManageSpaceForm(null)}
            />}
        </>
    );
}

export default Home;
