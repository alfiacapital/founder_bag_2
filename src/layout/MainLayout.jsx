import React, { useState } from "react";
import {
    FaBars,
} from "react-icons/fa";
import SideBar from "../parts/SideBar.jsx";
import Footer from "../parts/Footer.jsx";
import Navbar from "../parts/Navbar.jsx";



  

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content */}
                <main className="flex-1 py-10 px-40 overflow-y-auto">
                    <div className="main-content-centered">
                    {/* Top bar with hamburger (mobile) */}
                    <div className="flex justify-between items-center mb-6 md:hidden">
                        <button onClick={() => setSidebarOpen(true)}>
                            <FaBars className="text-2xl" />
                        </button>
                        <h2 className="text-lg font-semibold">Dashboard</h2>
                    </div>

                    {/* Greeting + Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        {/* Left: Greeting */}
                        <div>
                            <h2 className="text-2xl font-semibold">
                                Good Afternoon, Aymane MTS
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Ready to blitz through your afternoon?
                            </p>
                        </div>
                    </div>

                   

                
                    <h1 className="text-xl font-medium mb-6 mt-10">Your Spaces</h1>
                    {/* Content Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[350px]">
                            <h3 className="text-lg font-semibold mb-2">Project Alpha</h3>
                            <p className="text-gray-400 text-sm">Complete the user interface design</p>
                        </div>
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[350px]">
                            <h3 className="text-lg font-semibold mb-2">Project Beta</h3>
                            <p className="text-gray-400 text-sm">Review and test the new features</p>
                        </div>
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[350px]">
                            <h3 className="text-lg font-semibold mb-2">Project Gamma</h3>
                            <p className="text-gray-400 text-sm">Update documentation and guides</p>
                        </div>
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[350px]">
                            <h3 className="text-lg text-dark-text1 font-semibold mb-2">Project Delta</h3>
                            <p className="text-gray-400 text-sm">Prepare for the upcoming presentation</p>
                        </div>
                    </div>

                    
                    {/* Content Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[350px]">
                            <h3 className="text-lg font-semibold mb-2">Project Alpha</h3>
                            <p className="text-gray-400 text-sm">Complete the user interface design</p>
                        </div>
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[350px]">
                            <h3 className="text-lg font-semibold mb-2">Project Beta</h3>
                            <p className="text-gray-400 text-sm">Review and test the new features</p>
                        </div>
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[350px]">
                            <h3 className="text-lg font-semibold mb-2">Project Gamma</h3>
                            <p className="text-gray-400 text-sm">Update documentation and guides</p>
                        </div>
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[350px]">
                            <h3 className="text-lg text-dark-text1 font-semibold mb-2">Project Delta</h3>
                            <p className="text-gray-400 text-sm">Prepare for the upcoming presentation</p>
                        </div>
                    </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
