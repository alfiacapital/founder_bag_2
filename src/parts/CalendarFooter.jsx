import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function CalendarFooter() {
    const { t } = useTranslation("global");
    const {pathname} = useLocation();
    const navigate = useNavigate();
    return (
        <>
            {/* Responsive Footer */}
            <footer className={"flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 px-4  border-dark-stroke bg-dark-bg border-l border-r-2 "}>
                {/* Left Section - Navigation */}
                <div className="flex flex-wrap gap-2 sm:gap-2">
                    <button onClick={() => navigate("/")}
                            className={`text-sm transition-all duration-300 border rounded-button pt-3 pb-2 px-6 cursor-pointer font-bold 
                        ${pathname === "/"
                                ? "bg-dark-active text-dark-text1 border border-dark-stroke"
                                : "text-dark-text2 border-dark-stroke hover:text-dark-text1 hover:border-dark-stroke hover:bg-dark-active"
                            }`}>
                        {t('home')}
                    </button>
                    <button  onClick={() => navigate("/reports")}
                             className={`text-sm transition-all duration-300 border rounded-button pt-3 pb-2 px-6 cursor-pointer font-bold 
                        ${pathname === "/reports"
                                 ? "bg-dark-active text-dark-text1 border border-dark-stroke"
                                 : "text-dark-text2 border-dark-stroke hover:text-dark-text1 hover:border-dark-stroke hover:bg-dark-hover"
                             }`}>
                        {t('reports')}
                    </button>
                </div>


            </footer>
        </>
    );
}

export default CalendarFooter;
