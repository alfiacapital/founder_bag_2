import React from "react";
import Modal from "./Modal.jsx";
import { FiAlertTriangle } from "react-icons/fi";

function DeleteModal({ isOpen, title, message, onClick, onClose }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="flex flex-col items-center text-center space-y-4">
                {/* Warning Icon */}
                <div className="bg-red-500/10 text-red-500 rounded-full p-3">
                    <FiAlertTriangle className="w-8 h-8" />
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-white">
                    {title || "Delete Item"}
                </h2>

                {/* Message */}
                <p className="text-sm text-dark-text2">
                    {message || "Are you sure you want to delete this? This action cannot be undone."}
                </p>

                {/* Buttons */}
                <div className="flex gap-3 pt-2 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 rounded-xl bg-dark-bg hover:bg-dark-bg3 text-dark-text2 hover:text-white transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClick}
                        className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default DeleteModal;
