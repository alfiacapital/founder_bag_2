import React from 'react'
import { FiPlus, FiFolder, FiFileText, FiCalendar, FiUsers, FiTrendingUp } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      id: 1,
      title: 'Create Space',
      description: 'Start a new workspace for your projects',
      icon: FiFolder,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/')
    },
    {
      id: 2,
      title: 'New Note',
      description: 'Capture your thoughts and ideas',
      icon: FiFileText,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/notes')
    },
    {
      id: 3,
      title: 'Schedule Event',
      description: 'Add a new event to your calendar',
      icon: FiCalendar,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/calendar')
    },
    {
      id: 4,
      title: 'View Reports',
      description: 'Check your productivity insights',
      icon: FiTrendingUp,
      color: 'from-orange-500 to-orange-600',
      action: () => navigate('/reports')
    }
  ]

  return (
    <div className="">
      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="group relative bg-dark-bg border border-dark-stroke rounded-lg p-4 hover:border-dark-stroke transition-all duration-300 hover:shadow-lg hover:shadow-black/20 text-left"
          >
            {/* Icon with gradient background */}
            <div className={`w-12 h-12 rounded-lg  bg-dark-bg2 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="w-6 h-6 text-dark-text1" />
            </div>

            {/* Title */}
            <h3 className="text-dark-text1 font-semibold text-sm sm:text-base mb-1">
              {action.title}
            </h3>

            {/* Description */}
            <p className="text-dark-text2 text-xs sm:text-sm leading-relaxed">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions

