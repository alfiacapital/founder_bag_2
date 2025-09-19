import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { FaBars } from "react-icons/fa";

function generateFakeKey(length = 256) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

export const services = [
    { name: 'A-LINK', icon: 'red', available: true, url: `https://alink.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'FOUNDER BAG', icon: 'blue', available: true, url: `https://founder.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'EAAS', icon: 'purple', available: true, url: `https://eaas.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'STARTUP', icon: 'blue', available: true, url: `https://startup.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'A-BRAIN', icon: 'yellow', available: true, url: `https://abrain.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'WORKSPACE', icon: 'yellow', available: true, url: "" },
];

function Navbar({ setSidebarOpen }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const darkMode = true;

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="flex items-senter justify-between px-4 md:px-6 py-0 pb-6 bg-dark-bg2 border-b border-dark-stroke">
            <div ref={dropdownRef} className="relative inline-block">
                {/* Logo button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center space-x-2 border border-dark-stroke  m-2
                     rounded-lg px-3 py-2 hover:border-dark-stroke
                     transition"
                >
                    {darkMode ? (
                        <img src={"/ALFIA_SYSTEM.png"} alt="Logo" className="h-6 " />
                    ) : (
                        <img src={"/ALFIA_SYSTEM_DARK.png"} alt="Logo" className="h-6" />
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
                           rounded-button px-4 py-3 cursor-pointer transition"
                        >
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold text-navy-900 dark:text-white ">
                                    {service.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <nav className="hidden md:flex items-center space-x-3  ">
                <a
                    href="#"
                    className="text-navy-900 dark:text-white hover:underline text-sm border border-dark-stroke rounded-button px-4 py-2 hover:border-dark-stroke"
                >
                    Support Portal
                </a>
                <a
                    href="#"
                    className="text-navy-900 dark:text-white hover:underline text-sm border border-dark-stroke rounded-button px-4 py-2 hover:border-dark-stroke"
                >
                    Manage Funds
                </a>
                <a
                    href="#"
                    className="text-navy-900 dark:text-white hover:underline text-sm border border-dark-stroke rounded-button px-4 py-2 hover:border-dark-stroke"
                >
                    Docs
                </a>
            </nav>

            <button 
                onClick={() => setSidebarOpen(true)}
                className="xl:hidden p-2 hover:bg-gray-800 rounded transition-colors duration-200"
                aria-label="Open sidebar"
            >
                <FaBars className="text-2xl" />
            </button>
        </header>
    );
}

export default Navbar;