import React from 'react'
import { useTranslation } from 'react-i18next'
import { axiosClient } from '../api/axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function UpcomingEvents() {
  const { i18n } = useTranslation("global");
  const isArabic = i18n.language === 'ar';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const res = await axiosClient.get('/events/five-upcoming-events');
      return res.data;
    },
  });

  // Helper function to format date
  const formatEventDate = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time parts for date comparison
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    let dateLabel = '';
    let dateDetail = '';

    if (eventDateOnly.getTime() === todayOnly.getTime()) {
      dateLabel = isArabic ? 'اليوم' : 'Today';
    } else if (eventDateOnly.getTime() === tomorrowOnly.getTime()) {
      dateLabel = isArabic ? 'غداً' : 'Tomorrow';
    } else {
      const daysOfWeek = isArabic 
        ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dateLabel = daysOfWeek[eventDate.getDay()];
    }

    const months = isArabic
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    dateDetail = `${months[eventDate.getMonth()]} ${eventDate.getDate()}`;

    return { dateLabel, dateDetail };
  };

  // Helper function to format time
  const formatEventTime = (dateString, allDay) => {
    if (allDay) {
      return isArabic ? 'طوال اليوم' : 'All Day';
    }

    const eventDate = new Date(dateString);
    const hours = eventDate.getHours();
    const minutes = eventDate.getMinutes();
    
    if (isArabic) {
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  };

  const navigate = useNavigate();

  const content = isArabic ? {
    title: 'لا تفوت ما يهمك',
    description: 'ابق في الصدارة مع الفعاليات القادمة في لمحة. من اجتماعات الفريق إلى المواعيد النهائية المهمة، احتفظ بكل شيء منظمًا ولا تفقد أبدًا تتبع ما هو التالي في جدول أعمالك.',
    noEvents: 'لا توجد فعاليات قادمة',
    loading: 'جاري التحميل...'
  } : {
    title: 'Never Miss What Matters',
    description: 'Stay ahead with your upcoming events at a glance. From team meetings to important deadlines, keep everything organized and never lose track of what\'s next on your agenda.',
    noEvents: 'No upcoming events',
    loading: 'Loading...'
  }

  // Process events from API data
  const events = data?.map(event => {
    const { dateLabel, dateDetail } = formatEventDate(event.start);
    const time = formatEventTime(event.start, event.allDay);
    
    return {
      id: event._id,
      title: event.title,
      date: dateLabel,
      dateDetail: dateDetail,
      time: time,
    };
  }) || [];

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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-dark-text2 text-sm">{content.loading}</p>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-red-500 text-sm">Error loading events</p>
            </div>
          ) : events.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-dark-text2 text-sm">{content.noEvents}</p>
            </div>
          ) : (
            events.map((event, index) => (
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
                    <h4 className="text-dark-text1 font-medium text-sm sm:text-base mb-1 cursor-pointer hover:underline capitalize" onClick={() => navigate(`/calendar`)}>
                      {event.title}
                    </h4>
                    <p className="text-dark-text2 text-xs sm:text-sm">
                      {event.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default UpcomingEvents

