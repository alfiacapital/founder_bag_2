import React, { useState, useRef, useEffect } from "react";
import { FiPlus, FiSend, FiTrash2, FiMenu, FiX, FiMessageSquare } from "react-icons/fi";
import { axiosClient } from "@/api/axios.jsx";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';
import { useTranslation } from "react-i18next";

export default function AlfiaAI() {
    const { t } = useTranslation("global");
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const messagesEndRef = useRef(null);
    const sidebarRef = useRef(null);

    // Load conversations on mount
    useEffect(() => {
        fetchConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load messages when active conversation changes
    useEffect(() => {
        if (activeConversationId) {
            fetchMessages(activeConversationId);
        }
    }, [activeConversationId]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                const menuButton = document.getElementById('menu-button');
                if (menuButton && !menuButton.contains(event.target)) {
                    setShowSidebar(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSidebar]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const response = await axiosClient.get("/conversations");
            setConversations(response.data);
            if (response.data.length > 0 && !activeConversationId) {
                setActiveConversationId(response.data[0]._id);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await axiosClient.get(`/conversations/${conversationId}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const createNewConversation = async () => {
        try {
            const response = await axiosClient.post("/conversations", {
                title: t('new-conversation')
            });
            setConversations([response.data, ...conversations]);
            setActiveConversationId(response.data._id);
            setMessages([]);
        } catch (error) {
            console.error("Error creating conversation:", error);
        }
    };

    const deleteConversation = async (conversationId) => {
        if (!confirm(t('are-you-sure-delete-conversation'))) return;

        try {
            await axiosClient.delete(`/conversations/${conversationId}`);
            const updatedConversations = conversations.filter(c => c._id !== conversationId);
            setConversations(updatedConversations);
            
            if (activeConversationId === conversationId) {
                setActiveConversationId(updatedConversations[0]?._id || null);
                setMessages([]);
            }
        } catch (error) {
            console.error("Error deleting conversation:", error);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            role: "user",
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages([...messages, userMessage]);
        const currentMessage = inputMessage;
        setInputMessage("");
        setIsLoading(true);

        try {
            // Use the flexible endpoint that creates conversation if needed
            const response = await axiosClient.post('/conversations/message', {
                message: currentMessage,
                conversationId: activeConversationId
            });

            // Add AI response
            setMessages(prev => [...prev, {
                role: "assistant",
                content: response.data.response,
                timestamp: new Date()
            }]);

            // If this was a new conversation, update the conversation list and set active
            if (!activeConversationId) {
                const newConversation = response.data.conversation;
                setConversations([newConversation, ...conversations]);
                setActiveConversationId(newConversation._id);
            } else if (messages.length === 0) {
                // Update conversation title if it's the first message in existing conversation
                const updatedConversations = conversations.map(c => 
                    c._id === activeConversationId 
                        ? { ...c, title: currentMessage.slice(0, 50) }
                        : c
                );
                setConversations(updatedConversations);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            // Optionally show error to user
            alert(t('failed-send-message'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const activeConversation = conversations.find(c => c._id === activeConversationId);
    // Detect if text is Arabic/RTL
    const isArabic = (text) => {
        const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        return arabicPattern.test(text);
    };

    return (
        <div className="flex h-full w-full bg-dark-bg text-white overflow-hidden relative">
            {/* Backdrop overlay */}
            {showSidebar && (
                <div 
                    className="absolute inset-0 bg-dark-bg/60 backdrop-blur-sm z-40"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            {/* Sidebar - Conversations List */}
            <div 
                ref={sidebarRef}
                className={`
                    absolute inset-y-0 left-0 z-50
                    w-80 bg-dark-bg2 border-r border-dark-stroke
                    flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-dark-stroke flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FiMessageSquare className="text-blue-500" size={20} />
                            <span className="font-semibold text-dark-text1">{t('conversations')}</span>
                        </div>
                        <button
                            onClick={() => setShowSidebar(false)}
                            className="text-dark-text2 hover:text-dark-text1 transition-colors p-1 hover:bg-dark-bg rounded"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                {/* New Conversation Button */}
                <div className="p-4">
                    <button
                        onClick={() => {
                            createNewConversation();
                            setShowSidebar(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-button transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <FiPlus size={20} />
                        <span className="font-medium">{t('new-chat')}</span>
                    </button>
                </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto px-2">
                        {conversations.length === 0 ? (
                            <div className="p-6 text-center text-dark-text2">
                                <FiMessageSquare className="mx-auto mb-3 opacity-30" size={48} />
                                <p className="text-sm text-dark-text1">{t('no-conversations-yet')}</p>
                                <p className="text-xs mt-1 opacity-70">{t('create-one-to-get-started')}</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {conversations.map((conv) => (
                                    <div
                                        key={conv._id}
                                        onClick={() => {
                                            setActiveConversationId(conv._id);
                                            setShowSidebar(false);
                                        }}
                                        className={`
                                            group relative px-3 py-3 rounded-button cursor-pointer 
                                            transition-all duration-200
                                            ${activeConversationId === conv._id 
                                                ? 'bg-blue-600/20 border border-blue-600/30' 
                                                : 'hover:bg-dark-bg border border-transparent'
                                            }
                                        `}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-dark-text1 truncate mb-1">
                                                    {conv.title || t('new-conversation')}
                                                </h3>
                                                <p className="text-xs text-dark-text2">
                                                    {conv.updatedAt ? format(new Date(conv.updatedAt), 'MMM d, h:mm a') : ''}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteConversation(conv._id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 text-dark-text2 hover:text-red-500 transition-all p-1 hover:bg-red-500/10 rounded"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <div className="h-16 border-b border-dark-stroke flex items-center justify-between px-4 lg:px-6 bg-dark-bg2/50 backdrop-blur-sm flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            id="menu-button"
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="text-dark-text2 hover:text-dark-text1 transition-colors p-2 hover:bg-dark-bg rounded-button"
                        >
                            <FiMenu size={22} />
                        </button>
                        <div className="flex items-center gap-3">
                            <img 
                                src="/alfia-ai.png" 
                                alt="ALFIA AI" 
                                className="w-8 h-8 rounded-full"
                            />
                            <h1 className="text-lg text-dark-text1 lg:text-xl font-semibold truncate mt-1.5">
                                {activeConversation?.title || "ALFIA AI"}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
                    {messages.length === 0 && !isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center max-w-md px-4">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 rounded-full"></div>
                                    <img 
                                        src="/alfia-ai.png" 
                                        alt="ALFIA AI" 
                                        className="relative w-20 h-20 lg:w-24 lg:h-24 mx-auto"
                                    />
                                </div>
                                <h2 className="text-xl lg:text-2xl font-bold mb-3 text-dark-text1">{t('welcome-to-alfia-ai')}</h2>
                                <p className="text-dark-text2 text-sm lg:text-base">
                                    {t('start-conversation-message')}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[90%] sm:max-w-[85%] lg:max-w-3xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-2xl shadow-lg ${
                                            message.role === 'user'
                                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                                                : 'bg-dark-bg2 border border-dark-stroke'
                                        }`}
                                        dir={isArabic(message.content) ? 'rtl' : 'ltr'}
                                    >
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            {message.role === 'assistant' && (
                                                <img 
                                                    src="/alfia-ai.png" 
                                                    alt="AI" 
                                                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0 mt-1"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                {message.role === 'user' ? (
                                                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                                                        {message.content}
                                                    </p>
                                                ) : (
                                                    <div className="text-sm text-dark-text1 sm:text-base leading-relaxed prose prose-invert prose-sm max-w-none break-words">
                                                        <ReactMarkdown
                                                            components={{
                                                                // Customize markdown elements with RTL support
                                                                h1: ({...props}) => <h1 className="text-xl text-dark-text1 font-bold mb-2 mt-4" {...props} />,
                                                                h2: ({...props}) => <h2 className="text-lg text-dark-text1 font-bold mb-2 mt-3" {...props} />,
                                                                h3: ({...props}) => <h3 className="text-base text-dark-text1 font-bold mb-1 mt-2" {...props} />,
                                                                p: ({...props}) => <p className="mb-2 text-dark-text1" {...props} />,
                                                                ul: ({...props}) => <ul className={`list-disc text-dark-text1 mb-2 space-y-1 ${isArabic(message.content) ? 'list-inside mr-4' : 'list-inside'}`} {...props} />,
                                                                ol: ({...props}) => <ol className={`list-decimal text-dark-text1 mb-2 space-y-1 ${isArabic(message.content) ? 'list-inside mr-4' : 'list-inside'}`} {...props} />,
                                                                li: ({...props}) => <li className={`text-dark-text1 ${isArabic(message.content) ? 'mr-2' : 'ml-2'}`} {...props} />,
                                                                code: ({inline, ...props}) => 
                                                                    inline ? (
                                                                        <code className="bg-dark-active  text-dark-text1 px-1 py-0.5 rounded text-sm" dir="ltr" {...props} />
                                                                    ) : (
                                                                        <code className="block bg-dark-active  text-dark-text1 p-2 rounded my-2 overflow-x-auto" dir="ltr" {...props} />
                                                                    ),
                                                                strong: ({...props}) => <strong className="font-bold text-dark-text1" {...props} />,
                                                                em: ({...props}) => <em className="italic text-dark-text1" {...props} />,
                                                                a: ({...props}) => <a className="text-dark-text1 hover:underline" {...props} />,
                                                                blockquote: ({...props}) => <blockquote className={`border-dark-stroke text-dark-text1 pl-4 italic my-2 ${isArabic(message.content) ? 'border-r-4 pr-4' : 'border-l-4'}`} {...props} />,
                                                            }}
                                                        >
                                                            {message.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                                <span className="text-xs opacity-60 mt-2 block">
                                                    {format(new Date(message.timestamp), 'h:mm a')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[90%] sm:max-w-[85%] lg:max-w-3xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-2xl bg-dark-bg2 border border-dark-stroke shadow-lg">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <img 
                                                src="/alfia-ai.png" 
                                                alt="AI" 
                                                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
                                            />
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-dark-stroke p-3 sm:p-4 lg:p-6 bg-dark-bg2/50 backdrop-blur-sm flex-shrink-0">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-end gap-2 sm:gap-3 bg-dark-bg border border-dark-stroke rounded-2xl p-3 sm:p-4 focus-within:border-blue-600/50 transition-colors">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={t('type-your-message')}
                                disabled={isLoading}
                                className="flex-1 bg-transparent text-dark-text1 placeholder-dark-text2 resize-none focus:outline-none max-h-32 min-h-[24px] text-sm lg:text-base"
                                rows={1}
                                style={{ 
                                    height: 'auto',
                                    minHeight: '24px'
                                }}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
                            >
                                <FiSend size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-dark-text2 text-center mt-2 sm:mt-3">
                            {t('press-enter-to-send')} <span className="text-dark-text1 font-medium">{t('enter-to-send')}</span> {t('to-send')} <span className="text-dark-text1 font-medium">{t('shift-enter-new-line')}</span> {t('for-new-line')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

