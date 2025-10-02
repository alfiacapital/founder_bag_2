import React, { useState, useEffect, useRef } from 'react';
import { GoSearch } from "react-icons/go";
import { SiGoogledocs } from "react-icons/si";
import { FiFolder } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/api/axios.jsx";
import { useUserContext } from '@/context/UserProvider';

export default function SearchModal({ isOpen, onClose }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchInputRef = useRef(null);
    const navigate = useNavigate();
    const {user} = useUserContext();
    // Fetch notes
    const { data: notes = [] } = useQuery({
        queryKey: ["notes-search"],
        queryFn: async () => {
            const res = await axiosClient.get('/notes');
            return res.data.notes;
        },
        enabled: isOpen,
    });

    // Fetch spaces
    const { data: spacesData } = useQuery({
        queryKey: ["spaces-search"],
        queryFn: async () => {
            const res = await axiosClient.get(`/space/${user._id}`);
            return res.data;
        },
        enabled: isOpen && !!user?._id,
    });

    // Extract the data array from the response
    const spaces = spacesData || [];

    // Filter results based on search query
    const searchTerm = searchQuery.trim().toLowerCase();
    
    const filteredNotes = notes?.filter(note =>
        note.title?.toLowerCase().includes(searchTerm)
    );

    const filteredSpaces = spaces?.filter(space => {
        const spaceName = space.name?.toLowerCase() || '';
        return spaceName.includes(searchTerm);
    });

    const allResults = [
        ...filteredNotes.map(note => ({ type: 'note', data: note })),
        ...filteredSpaces.map(space => ({ type: 'space', data: space }))
    ];

    // Reset selected index when search query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [searchQuery]);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            searchInputRef.current?.focus();
            setSearchQuery("");
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (allResults[selectedIndex]) {
                    handleSelect(allResults[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, selectedIndex, allResults]);

    // Handle keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (isOpen) {
                    onClose();
                } else {
                    // This will be handled by parent component
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSelect = (result) => {
        if (result.type === 'note') {
            navigate(`/note/${result.data._id}`);
        } else if (result.type === 'space') {
            navigate(`/space/${result.data._id}/board`);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 backdrop-blur-[2px] z-50  bg-opacity-20"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-dark-bg2 border border-dark-stroke rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-dark-stroke">
                    <GoSearch className="text-dark-text2 text-xl flex-shrink-0" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes and spaces..."
                        className="flex-1 bg-transparent text-white placeholder-dark-text2 focus:outline-none text-base"
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-dark-text2 bg-dark-bg border border-dark-stroke rounded">
                        <span>ESC</span>
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {searchQuery === "" ? (
                        <div className="p-8 text-center text-dark-text2">
                            <GoSearch className="mx-auto text-4xl mb-3 opacity-50" />
                            <p className="text-sm">Start typing to search notes and spaces</p>
                            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <kbd className="px-2 py-1 bg-dark-bg border border-dark-stroke rounded">↑</kbd>
                                    <kbd className="px-2 py-1 bg-dark-bg border border-dark-stroke rounded">↓</kbd>
                                    <span>Navigate</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-2 py-1 bg-dark-bg border border-dark-stroke rounded">↵</kbd>
                                    <span>Select</span>
                                </div>
                            </div>
                        </div>
                    ) : allResults.length === 0 ? (
                        <div className="p-8 text-center text-dark-text2">
                            <p className="text-sm">No results found for "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {/* Notes Section */}
                            {filteredNotes.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-dark-text2 uppercase">
                                        Notes
                                    </div>
                                    {filteredNotes.map((note, index) => {
                                        const globalIndex = index;
                                        return (
                                            <button
                                                key={note._id}
                                                onClick={() => handleSelect({ type: 'note', data: note })}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                                    selectedIndex === globalIndex
                                                        ? 'bg-dark-active border-l-2 border-blue-500'
                                                        : 'hover:bg-dark-hover'
                                                }`}
                                            >
                                                <SiGoogledocs className="text-dark-text2 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white truncate">{note.title}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Spaces Section */}
                            {filteredSpaces.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-dark-text2 uppercase">
                                        Spaces
                                    </div>
                                    {filteredSpaces.map((space, index) => {
                                        const globalIndex = filteredNotes.length + index;
                                        return (
                                            <button
                                                key={space._id}
                                                onClick={() => handleSelect({ type: 'space', data: space })}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                                    selectedIndex === globalIndex
                                                        ? 'bg-dark-active border-l-2 border-blue-500'
                                                        : 'hover:bg-dark-hover'
                                                }`}
                                            >
                                                <FiFolder className="text-dark-text2 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white truncate">{space.name}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-dark-stroke bg-dark-bg flex items-center justify-between text-xs text-dark-text2">
                    <div className="flex items-center gap-3">
                        <span>Type to search</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-dark-bg2 border border-dark-stroke rounded">⌘K</kbd>
                        <span>to toggle</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

