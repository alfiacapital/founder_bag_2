import React from 'react'
import { FiPlus, FiFolder, FiFileText, FiCalendar, FiUsers, FiTrendingUp } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
function QuickActions() {
  const navigate = useNavigate()
  const { t } = useTranslation("global")
  const actions = [
    {
      id: 1,
      title: t('create-new-space'),
      description: 'Start a new workspace for your projects',
      icon: FiFolder,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/')
    },
    {
      id: 2,
      title: t('add-new-note'),
      description: 'Capture your thoughts and ideas',
      icon: FiFileText,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/notes')
    },
    {
      id: 3,
      title: t('schedule-event'),
      description: 'Add a new event to your calendar',
      icon: FiCalendar,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/calendar')
    },
    {
      id: 4,
      title: t('view-reports'),
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
            className="group relative bg-dark-bg border border-dark-stroke rounded-default p-4 hover:border-dark-stroke transition-all duration-300 hover:shadow-lg hover:shadow-black/20 text-left"
          >
            {/* Icon with gradient background */}
            <div className={`w-12 h-12 rounded-button  bg-dark-active flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="w-6 h-6 text-dark-text1" />
            </div>

            {/* Title */}
            <h3 className="text-dark-text1 text-left rtl:text-right  font-semibold text-sm sm:text-base mb-1">
              {action.title}
            </h3>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions

