import React, { useState } from "react";
import SideBar from "../parts/SideBar.jsx";
import Footer from "../parts/Footer.jsx";
import Navbar from "../parts/Navbar.jsx";

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
            <Navbar setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 overflow-hidden mx-0">
                <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content */}
                <main className="flex-1 py-6 xl:py-7 px-4 md:px-8 xl:px-40 overflow-y-auto">
                    <div className="main-content-centered">
                    

                    {/* Greeting + Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        {/* Left: Greeting */}
                        <div>
                            <h2 className="text-2xl font-semibold">
                                Good Afternoon, STARTUP FOUNDER
                            </h2>
                            <p className="text-dark-text2 text-sm">
                                Ready to Alfia System through your afternoon?
                            </p>
                        </div>
                    </div>

                   

                
                    <h1 className="text-md font-medium mb-4 mt-6">Your Spaces</h1>
                    {/* Content Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-4">


                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[280px] hover:text-white hover:border-dark-stroke hover:bg-dark-hover cursor-pointer transition-all duration-300">
                            <h3 className="text-lg font-semibold mb-2">Project Alpha</h3>
                            <p className="text-dark-text2 text-sm">Complete the user interface design</p>
                        </div>


                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[280px] hover:text-white hover:border-dark-stroke hover:bg-dark-hover cursor-pointer transition-all duration-300">
                            <h3 className="text-lg font-semibold mb-2">Project Beta</h3>
                            <p className="text-dark-text2 text-sm">Review and test the new features</p>
                        </div>
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[280px] hover:text-white hover:border-dark-stroke hover:bg-dark-hover cursor-pointer transition-all duration-300">
                            <h3 className="text-lg font-semibold mb-2">Project Gamma</h3>
                            <p className="text-dark-text2 text-sm">Update documentation and guides</p>
                        </div>
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[280px] hover:text-white hover:border-dark-stroke hover:bg-dark-hover cursor-pointer transition-all duration-300">
                            <h3 className="text-lg text-dark-text1 font-semibold mb-2">Project Delta</h3>
                            <p className="text-dark-text2 text-sm">Prepare for the upcoming presentation</p>
                        </div>
                    </div>

                    
                    {/* Content Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[280px] hover:text-white hover:border-dark-stroke hover:bg-dark-hover cursor-pointer transition-all duration-300">
                            <h3 className="text-lg font-semibold mb-2">Project Alpha</h3>
                            <p className="text-dark-text2 text-sm">Complete the user interface design</p>
                        </div>
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[280px] hover:text-white hover:border-dark-stroke hover:bg-dark-hover cursor-pointer transition-all duration-300">
                            <h3 className="text-lg font-semibold mb-2">Project Beta</h3>
                            <p className="text-dark-text2 text-sm">Review and test the new features</p>
                        </div>
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[280px] hover:text-white hover:border-dark-stroke hover:bg-dark-hover cursor-pointer transition-all duration-300">
                            <h3 className="text-lg font-semibold mb-2">Project Gamma</h3>
                            <p className="text-dark-text2 text-sm">Update documentation and guides</p>
                        </div>
                        <div className="bg-dark-bg2 border border-dark-stroke rounded-default p-6 h-[280px] hover:text-white hover:border-dark-stroke hover:bg-dark-hover cursor-pointer transition-all duration-300">
                            <h3 className="text-lg text-dark-text1 font-semibold mb-2">Project Delta</h3>
                            <p className="text-dark-text2 text-sm">Prepare for the upcoming presentation</p>
                        </div>
                    </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
