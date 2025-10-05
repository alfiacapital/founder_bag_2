import React, { useRef } from 'react'
import { FiChevronRight, FiFileText, FiClock } from 'react-icons/fi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'

function RecentNotesSlider({ notes = [], isLoading = false }) {
  const swiperRef = useRef(null)
  const navigate = useNavigate()

  return (
    <div>
      {/* Swiper Container */}
      <div className="relative group w-full">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode={true}
          loop={true}
          loopAdditionalSlides={2}
          navigation={{
            nextEl: '.swiper-button-next-notes',
            prevEl: '.swiper-button-prev-notes',
          }}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 20,
            }
          }}
          className="recent-notes-swiper w-full"
        >
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <SwiperSlide key={`loading-${index}`} className="!w-auto">
                <div className="w-44 sm:w-48 h-30 bg-dark-bg2 border border-dark-stroke rounded-xl p-3 sm:p-4 animate-pulse">
                  <div className="flex justify-center mb-3">
                    <div className="w-6 h-6 bg-gray-700 rounded"></div>
                  </div>
                  <div className="text-center mb-3">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4 mx-auto"></div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                    <div className="h-3 w-12 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : notes.length > 0 ? (
            notes?.map((note, index) => (
              <SwiperSlide key={index} className="!w-auto">
                <div 
                  className="w-44 sm:w-48 h-30 bg-dark-bg border border-dark-stroke rounded-xl hover:border-dark-stroke transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-black/20 flex flex-col"
                  onClick={() => navigate(`/note/${note.id}`)}
                >
                  {/* Icon */}
                  <div className="flex justify-center px-4 pt-4">
                    <div className="text-dark-text2 group-hover:scale-110 transition-transform duration-300">
                      <FiFileText className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="text-center px-2 flex-1 flex flex-col justify-center">
                    <h3 className="text-dark-text2 font-medium text-xs truncate sm:text-sm leading-tight line-clamp-2">
                      {note.title || 'Untitled Note'}
                    </h3>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-center pb-2 pt-2 px-2 rounded-b-xl text-xs bg-dark-bg2">
                    <div className="flex items-center gap-1">
                      <FiClock className="w-3 h-3 text-dark-text2 mb-1" />
                      <span className="text-dark-text2">
                        Last update: {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            // Empty state
            <SwiperSlide className="!w-auto">
              <div className="w-44 sm:w-48 h-30 bg-dark-bg2 border border-dark-stroke rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center">
                <FiFileText className="w-8 h-8 text-gray-600 mb-2" />
                <p className="text-dark-text2 text-sm">No notes yet</p>
                <p className="text-gray-500 text-xs">Create your first note</p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        <div className='absolute -right-8 -top-[5px] h-40 w-40 bg-gradient-to-l from-black to-transparent z-5 pointer-events-none' />

        {/* Custom Navigation Buttons - Only visible on hover */}
        <button className="swiper-button-prev-notes absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-dark-bg2 border border-dark-stroke hover:bg-dark-hover hover:border-dark-stroke text-dark-text2 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-lg opacity-0 group-hover:opacity-100">
          <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
        </button>
        
        <button className="swiper-button-next-notes absolute -right-6 top-1/2 z-10 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-dark-bg2 border border-dark-stroke hover:bg-dark-hover hover:border-dark-stroke text-dark-text2 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 z-10 shadow-lg opacity-0 group-hover:opacity-100">
          <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Custom Swiper Styles */}
      <style>{`
        .recent-notes-swiper {
          padding: 0;
          width: 100%;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        .recent-notes-swiper .swiper-slide {
          width: auto !important;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        .recent-notes-swiper .swiper-slide * {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        .swiper-button-prev-notes.swiper-button-disabled,
        .swiper-button-next-notes.swiper-button-disabled {
          display: none;
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  )
}

export default RecentNotesSlider

