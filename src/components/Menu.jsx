import React, { useState, useRef, useEffect } from "react";

function Menu({ button, items = [] }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            {/* Trigger button (passed from parent) */}
            <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
                {button}
            </div>

            {/* Dropdown menu */}
            {open && (
                <div 
                    className={`absolute right-0 mt-1 w-40 origin-top-right rounded-lg bg-dark-bg2 border border-dark-stroke shadow-lg z-50 ${
                        items.length > 4 ? 'max-h-[240px] overflow-y-auto menu-scroll' : ''
                    }`}
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#444444 #1a1a1a'
                    }}
                >
                    {items.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setOpen(false);
                                item.onClick?.();
                            }}
                            className={`w-full px-4 py-2 pt-3 text-left text-sm  ${
                                item.danger
                                    ? "text-red-500 hover:bg-red-600 hover:text-white"
                                    : "text-white hover:bg-dark-hover"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Menu;
