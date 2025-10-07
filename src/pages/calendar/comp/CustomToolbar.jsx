import React, {useEffect, useRef, useState} from "react";
import {TbMenu2} from "react-icons/tb";
import {IoIosArrowBack, IoIosArrowDown, IoIosArrowForward} from "react-icons/io";
import MiniCalendar from "@/components/MiniCalendar.jsx";
import Menu from "@/components/Menu.jsx";
import { useUserContext } from "@/context/UserProvider";
import { services } from "@/utils/servicesConfig";
import UserMenu from "@/components/UserMenu";
import { useTranslation } from "react-i18next";

export default function CustomToolbar({ label, onNavigate, onView, view, onOpenMiniCalendar, showMiniCalendar, selectedDate, setSelectedDate, setCurrentDate, setShowMiniCalendar, onOpenSidebar }) {
    const { t } = useTranslation("global");
    const [open, setOpen] = useState(false)
    const toolbarRef = useRef(null);
    const {darkMode} = useUserContext();

    // Click outside listener
    useEffect(() => {
        function handleClickOutside(event) {
            if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setOpen]);  return (
        <div>
            <div ref={toolbarRef} dir="ltr" className="fixed top-0 left-0 right-0 z-999   flex justify-between items-center bg-dark-bg2  text-dark-text2 py-4 px-3  ">
                <div className={"flex items-center gap-4"}>
                    {/* Sidebar Toggle Button */}
                    <div
                        className="p-2 text-dark-text2 hover:text-dark-text1 hover:bg-dark-hover rounded-full cursor-pointer"
                        onClick={onOpenSidebar}
                        title={t('open-sidebar')}
                    >
                        <TbMenu2 className="w-6 h-6" />
                    </div>

                    <div>
                        <button
                            onClick={() => setOpen(!open)}
                            className="hidden md:flex items-center space-x-2 border border-dark-stroke
                     rounded-lg px-4 pb-1.5 pt-2 hover:border-dark-stroke
                     transition"
                        >
                            {darkMode ? (
                                <img src={"/ALFIA_SYSTEM.png"} alt="Logo" className="h-8 " />
                            ) : (
                                <img src={"/ALFIA_SYSTEM_DARK.png"} alt="Logo" className="h-8" />
                            )}
                            <IoIosArrowDown className="w-4 h-4 text-gray-400" />
                        </button>


                        {/* Dropdown Cards with transition */}
                        <div
                            className={`absolute left-0 mt-3 w-[700px] bg-dark-bg 
                      border border-dark-stroke 
                      rounded-button shadow-lg p-3 grid grid-cols-2 gap-2 z-50
                      transform transition-all duration-300 ease-out
                      ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                        >
                            {services.map((service, idx) => (
                                <div
                                    onClick={() => {
                                        if (service.url) window.open(service.url, "_blank"), setOpen(false);
                                    }}
                                    key={idx}
                                    className="flex flex-col justify-start h-[120px] bg-dark-bg2
                           border border-dark-stroke hover:border-dark-stroke
                           rounded-button px-4 py-3 cursor-pointer transition "
                                >
                                    <div className="flex flex-col">
                                <span className="text-lg font-semibold text-dark-text1">
                                    {service.name}
                                </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div onClick={() => onNavigate("TODAY")}
                         className={"hidden md:flex border border-dark-stroke text-dark-text2 rounded-button px-4 pb-2 pt-3 hover:text-dark-text1 hover:bg-dark-hover hover:border-dark-stroke cursor-pointer"}>
                        <span className={"text-md font-medium"}>{t('today')}</span>
                    </div>
                    <div onClick={() => onNavigate("PREV")} className={"hidden md:flex p-2 text-dark-text2 hover:text-dark-text1 hover:bg-dark-hover rounded-full cursor-pointer"}>
                        <IoIosArrowBack className={"h-6 w-6"} />
                    </div>
                    <div onClick={() => onNavigate("NEXT")} className={"hidden md:flex p-2 text-dark-text2 hover:text-dark-text1 hover:bg-dark-hover rounded-full cursor-pointer"}>
                        <IoIosArrowForward className={"h-6 w-6"} />
                    </div>
                    <div className="relative">
                        <div
                            className={"font-medium text-dark-text2 mt-2 text-xl cursor-pointer hover:text-dark-text1 transition-colors"}
                            onClick={onOpenMiniCalendar}
                            title={t('click-to-select-date')}
                        >
                            {label}
                        </div>
                        <MiniCalendar
                            isOpen={showMiniCalendar}
                            onClose={() => setShowMiniCalendar(false)}
                            selectedDate={selectedDate}
                            onDateSelect={(date) => {
                                setSelectedDate(date);
                                setCurrentDate(date);
                            }}
                        />
                    </div>
                </div>

                <div className={"flex items-center gap-4"}>
                    <Menu
                        button={
                            <button className="border border-dark-stroke text-dark-text2 rounded-button px-4 pb-2 pt-3 hover:text-dark-text1 hover:bg-dark-hover hover:border-dark-stroke cursor-pointer capitalize">
                                {view === 'month' ? t('view-month') : view === 'week' ? t('view-week') : t('view-day')}
                            </button>
                        }
                        items={[
                            {
                                label: t('view-month'),
                                onClick: () => onView("month"),
                            },
                            {
                                label: t('view-week'),
                                onClick: () => onView("week"),
                            },
                            {
                                label: t('view-day'),
                                onClick: () => onView("day"),
                            },
                        ]}
                    />
                    <UserMenu />
                </div>
            </div>
        </div>
    );
}
