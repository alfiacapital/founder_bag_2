import React from 'react'
import { useTranslation } from 'react-i18next'

function UpcomingEvents() {
  const { t, i18n } = useTranslation("global");
  const isArabic = i18n.language === 'ar';

  // Mock data - conditional based on language
  const events = isArabic ? [
    {
      id: 1,
      title: 'فعالية ALFIA للشركات الناشئة',
      date: 'اليوم',
      dateDetail: 'أكتوبر 4',
      time: '9 صباحاً',
      location: 'بركان',
    },
    {
      id: 2,
      title: 'فعالية CIH و ALFIA',
      date: 'الأحد',
      dateDetail: 'أكتوبر 5',
      time: '10 صباحاً',
      location: 'وجدة',
    }
  ] : [
    {
      id: 1,
      title: 'ALFIA Startup Event',
      date: 'Today',
      dateDetail: 'Oct 4',
      time: '9 AM',
      location: 'Berkan',
    },
    {
      id: 2,
      title: 'CIH & ALFIA Event',
      date: 'Sun',
      dateDetail: 'Oct 5',
      time: '10 AM',
      location: 'Oujda',
    }
  ];

  const content = isArabic ? {
    title: 'لا تفوت ما يهمك',
    description: 'ابق في الصدارة مع الفعاليات القادمة في لمحة. من اجتماعات الفريق إلى المواعيد النهائية المهمة، احتفظ بكل شيء منظمًا ولا تفقد أبدًا تتبع ما هو التالي في جدول أعمالك.'
  } : {
    title: 'Never Miss What Matters',
    description: 'Stay ahead with your upcoming events at a glance. From team meetings to important deadlines, keep everything organized and never lose track of what\'s next on your agenda.'
  }

  return (
    <div className="bg-dark-bg2 border border-dark-stroke rounded-xl p-4 sm:p-6">     
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Section: Description */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-dark-text1 font-semibold text-base sm:text-lg mb-2 sm:mb-3">
              {content.title}
            </h3>
            <p className="text-dark-text2 text-sm sm:text-base leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>

        {/* Right Section: Events List */}
        <div className="border-t lg:border-t-0 lg:border-l rtl:lg:border-l-0 rtl:lg:border-r border-dark-stroke pt-6 lg:pt-0 lg:pl-6 xl:pl-8 rtl:lg:pl-0 rtl:lg:pr-6 rtl:xl:pr-8 space-y-4 sm:space-y-5">
          {events.map((event, index) => (
            <div key={event.id}>
              <div className="flex gap-3 sm:gap-4">
                {/* Date */}
                <div className="flex flex-col items-center min-w-[50px] sm:min-w-[60px]">
                  <span className="text-dark-text2 text-xs">{event.date}</span>
                  <span className="text-dark-text2 text-sm font-medium">{event.dateDetail}</span>
                </div>

                {/* Vertical Line */}
                <div className="relative flex flex-col items-center">
                  <div className="w-2 h-2 bg-dark-text2 rounded-full mt-1"></div>
                  {index < events.length - 1 && (
                    <div className="w-px h-full bg-dark-stroke mt-1"></div>
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 pb-4 sm:pb-5">
                  <h4 className="text-dark-text1 font-medium text-sm sm:text-base mb-1">
                    {event.title}
                  </h4>
                  <p className="text-dark-text2 text-xs sm:text-sm">
                    {event.time} · {event.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UpcomingEvents

