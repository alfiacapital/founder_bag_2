import React from "react";
import { useTranslation } from "react-i18next";

const Modal = ({ isOpen, onClose, children, size = "md" }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        '2xl': "max-w-4xl",
        full: "w-full",
    };
    const { i18n } = useTranslation("global");
    return (
        <div
            className="fixed inset-0 flex items-center justify-center
                 backdrop-blur-[2px] z-50  bg-opacity-20"
            onClick={onClose}
        >
            <div
                className={`bg-dark-bg2 border border-dark-stroke rounded-[22px] shadow-lg p-6 w-full ${sizeClasses[size]} relative`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={`absolute top-5 ${i18n.dir() === "rtl" ? "left-6" : "right-6"} text-dark-text2 hover:text-white text-md font-bold cursor-pointer`}
                    onClick={onClose}
                >
                    &#x2715;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
