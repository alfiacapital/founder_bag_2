import React, { useState, useRef, useEffect } from "react";
import { FiPlus, FiSend, FiTrash2, FiEdit2, FiMenu } from "react-icons/fi";
import { axiosClient } from "@/api/axios.jsx";
import { format } from "date-fns";
import Footer from "@/parts/Footer";
import Navbar from "@/parts/Navbar";
import ReactMarkdown from 'react-markdown';

export default function AlfiaAI() {
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const messagesEndRef = useRef(null);

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
                title: "New Conversation"
            });
            setConversations([response.data, ...conversations]);
            setActiveConversationId(response.data._id);
            setMessages([]);
        } catch (error) {
            console.error("Error creating conversation:", error);
        }
    };

    const deleteConversation = async (conversationId) => {
        if (!confirm("Are you sure you want to delete this conversation?")) return;

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
            alert("Failed to send message. Please try again.");
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

    return (
        <div className="flex flex-col h-screen bg-dark-bg2 text-white overflow-hidden">
            {/* Navbar */}
            <Navbar setSidebarOpen={() => {}} />

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Conversations List */}
                {showSidebar && (
                    <div className="w-80 bg-[#070707] border-r border-[#1f1f1f] flex flex-col">
                    {/* Header */}
                    <div className="p-4  border-[#1f1f1f]">
                        <button
                            onClick={createNewConversation}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            <FiPlus size={20} />
                            <span className="font-medium">New Conversation</span>
                        </button>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-4 text-center text-dark-text2">
                                No conversations yet. Create one to get started!
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv._id}
                                    onClick={() => setActiveConversationId(conv._id)}
                                    className={`group p-4 border-b border-[#1f1f1f] cursor-pointer transition-colors hover:bg-[#1a1a1a] ${
                                        activeConversationId === conv._id ? 'bg-[#1a1a1a]' : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-white truncate">
                                                {conv.title || "New Conversation"}
                                            </h3>
                                            <p className="text-xs text-dark-text2 mt-1">
                                                {conv.updatedAt ? format(new Date(conv.updatedAt), 'MMM d, h:mm a') : ''}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteConversation(conv._id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 text-dark-text2 hover:text-red-500 transition-all"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="h-16 border-b border-[#1f1f1f] flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="text-dark-text2 hover:text-white transition-colors"
                        >
                            <FiMenu size={24} />
                        </button>
                        <h1 className="text-xl font-semibold">
                            {activeConversation?.title || "ALFIA AI"}
                        </h1>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 && !isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center max-w-md">
                                <img 
                                    src="/alfia-ai.png" 
                                    alt="ALFIA AI" 
                                    className="w-24 h-24 mx-auto mb-4 opacity-50"
                                />
                                <h2 className="text-2xl font-bold mb-2">Welcome to ALFIA AI</h2>
                                <p className="text-dark-text2">
                                    Start a conversation by typing a message below. I'm here to help!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-3xl px-6 py-4 rounded-2xl ${
                                            message.role === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-[#1a1a1a] border border-[#1f1f1f]'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {message.role === 'assistant' && (
                                                <img 
                                                    src="/alfia-ai.png" 
                                                    alt="AI" 
                                                    className="w-6 h-6 rounded-full"
                                                />
                                            )}
                                             <div className="flex-1">
                                                {message.role === 'user' ? (
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                        {message.content}
                                                    </p>
                                                ) : (
                                                    <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                                                        <ReactMarkdown
                                                            components={{
                                                                // Customize markdown elements
                                                                h1: ({...props}) => <h1 className="text-xl font-bold mb-2 mt-4" {...props} />,
                                                                h2: ({...props}) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
                                                                h3: ({...props}) => <h3 className="text-base font-bold mb-1 mt-2" {...props} />,
                                                                p: ({...props}) => <p className="mb-2" {...props} />,
                                                                ul: ({...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                                                                ol: ({...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                                                                li: ({...props}) => <li className="ml-2" {...props} />,
                                                                code: ({inline, ...props}) => 
                                                                    inline ? (
                                                                        <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />
                                                                    ) : (
                                                                        <code className="block bg-gray-800 p-2 rounded my-2 overflow-x-auto" {...props} />
                                                                    ),
                                                                strong: ({...props}) => <strong className="font-bold text-white" {...props} />,
                                                                em: ({...props}) => <em className="italic" {...props} />,
                                                                a: ({...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                                                                blockquote: ({...props}) => <blockquote className="border-l-4 border-gray-600 pl-4 italic my-2" {...props} />,
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
                                    <div className="max-w-3xl px-6 py-4 rounded-2xl bg-[#1a1a1a] border border-[#1f1f1f]">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src="/alfia-ai.png" 
                                                alt="AI" 
                                                className="w-6 h-6 rounded-full"
                                            />
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-dark-text2 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-dark-text2 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                                <span className="w-2 h-2 bg-dark-text2 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className=" border-[#1f1f1f] p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-end gap-4 bg-[#1a1a1a] border border-[#1f1f1f] rounded-2xl p-3">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="flex-1 bg-transparent text-white placeholder-dark-text2 resize-none focus:outline-none max-h-32 min-h-[24px]"
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
                                className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-colors"
                            >
                                <FiSend size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-dark-text2 text-center mt-3">
                            Press Enter to send, Shift + Enter for new line
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <Footer />
                </div>
            </div>
        </div>
    );
}

