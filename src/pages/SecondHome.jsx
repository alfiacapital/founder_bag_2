import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { axiosClient } from '../api/axios.jsx'
import { useUserContext } from '../context/UserProvider.jsx'
import RecentSpacesSlider from '../components/space/RecentSpacesSlider.jsx'
import RecentNotesSlider from '../components/notes/RecentNotesSlider.jsx'
import UpcomingEvents from '../components/UpcomingEvents.jsx'
import QuickActions from '../components/QuickActions.jsx'
import { FiCalendar, FiClock, FiFileText, FiZap } from 'react-icons/fi'

function SecondHome() {
  const { user } = useUserContext()
  
  // Fetch recent spaces data using the optimized API
  const { data: recentSpaces = [], isLoading: isLoadingSpaces } = useQuery({
    queryKey: ["recent-spaces"],
    queryFn: async () => await axiosClient.get(`/space/recent/list?limit=8`),
    select: res => res.data,
    enabled: !!user?._id,
  })

  // Fetch recent notes data
  const { data: recentNotesData, isLoading: isLoadingNotes } = useQuery({
    queryKey: ["recent-notes"],
    queryFn: async () => await axiosClient.get(`/notes/recently`),
    enabled: !!user?._id,
  })

  // Map the API response to the format needed for the UI
  const recentlyVisitedSpaces = recentSpaces.map(space => ({
    id: space._id,
    title: space.name,
    description: space.description || '',
    updatedAt: space.lastActivity || space.updatedAt,
    createdAt: space.createdAt,
    taskCount: space.tasksCount || 0,
    completedTasks: space.tasks?.filter(task => 
      task.status?.title?.toLowerCase() === 'done' || 
      task.status?.title?.toLowerCase() === 'completed'
    ).length || 0,
    color: space.color,
    lastTaskTitle: space.lastTaskTitle,
    isOwner: space.isOwner,
    type: 'space'
  }))

  // Map recent notes data - handle different response structures
  const recentNotes = recentNotesData?.data?.notes ||  []
  const recentlyVisitedNotes = Array.isArray(recentNotes) ? recentNotes.map(note => ({
    id: note._id,
    title: note.title,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  })) : []

  return (
    <div className="bg-dark-bg text-white min-h-screen p-4 sm:p-6">
      {/* Quick Actions Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FiZap className="text-white w-4 h-4 mb-1" />
          <h2 className="text-md font-semibold text-white">Quick Actions</h2>
        </div>
        <QuickActions />
      </div>

      
      {/* Recently Visited Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FiClock className="text-white w-4 h-4 mb-1" />
          <h2 className="text-md font-semibold text-white">Last Spaces Created</h2>
        </div>
        <RecentSpacesSlider 
          spaces={recentlyVisitedSpaces} 
          isLoading={isLoadingSpaces} 
        />
      </div>

      {/* Upcoming Events Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FiCalendar className="text-white w-4 h-4 mb-1" />
          <h2 className="text-md font-semibold text-white">Upcoming events</h2>
        </div>
        <UpcomingEvents />
      </div>

      {/* Recent Notes Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FiFileText className="text-white w-4 h-4 mb-1.5" />
          <h2 className="text-md font-semibold text-white">Recent Notes</h2>
        </div>
        <RecentNotesSlider 
          notes={recentlyVisitedNotes} 
          isLoading={isLoadingNotes} 
        />
      </div>

      
    </div>
  )
}

export default SecondHome   