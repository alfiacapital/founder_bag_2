import React from "react";

const Modal = ({ isOpen, onClose, children, size = "md" }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "w-full",
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center
                 backdrop-blur-[2px] z-50  bg-opacity-20"
            onClick={onClose}
        >
            <div
                className={`bg-dark-bg2 border border-[#444444] rounded-[22px] shadow-lg p-6 w-full ${sizeClasses[size]} relative`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-5 right-6 text-dark-text2 hover:text-white text-md font-bold cursor-pointer"
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
