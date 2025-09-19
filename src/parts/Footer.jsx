import React from 'react';
import { useLocation } from 'react-router-dom';

function Footer(props) {
    const {pathname} = useLocation();
    return (
        <>
            {/* Responsive Footer */}
            <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 sm:p-6 sm:py-[15px] px-4 sm:px-8 md:px-10 border-t border-dark-stroke bg-dark-bg2 gap-4 sm:gap-0">
                {/* Left Section - Navigation */}
                <div className="flex flex-wrap gap-2 sm:gap-2">
                    <button className={`text-sm transition-colors duration-200 border rounded-button pt-3 pb-2 px-6 cursor-pointer font-bold 
                        ${pathname === "/" 
                            ? "bg-dark-active text-white  border border-[#444444]" 
                            : "text-dark-text2 border-dark-stroke hover:text-white hover:border-dark-stroke hover:bg-dark-active"
                        }`}>
                        Home
                    </button>
                    <button className={`text-sm transition-colors duration-200 border rounded-button pt-3 pb-2 px-6 cursor-pointer font-bold 
                        ${pathname === "/reports" 
                            ? "bg-dark-active text-white  border border-[#444444]" 
                            : "text-dark-text2 border-dark-stroke hover:text-white hover:border-dark-stroke hover:bg-[#181818]"
                        }`}>
                        Reports
                    </button>
                </div>
                
               
            </footer>
        </>
    );
}

export default Footer;
