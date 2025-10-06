import React, { useState, useEffect } from "react";
import SideBar from "../parts/SideBar.jsx";
import Footer from "../parts/Footer.jsx";
import Navbar from "../parts/Navbar.jsx";
import {Outlet, useLocation} from "react-router-dom";

export default function MainLayout() {
    const {pathname} = useLocation()
    
    // Check if mobile on initial render
    const isMobile = () => window.innerWidth < 1280; // xl breakpoint
    
    // Initialize sidebar state based on screen size and pathname
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (pathname.startsWith("/space")) return false;
        return !isMobile(); // Close on mobile by default
    });
    
    // Handle pathname changes
    useEffect(() => {
        if (pathname.startsWith("/space")) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(!isMobile());
        }
    }, [pathname]);
    
    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (!pathname.startsWith("/space")) {
                setSidebarOpen(!isMobile());
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [pathname]);
    
    return (
        <div className="flex flex-col h-screen bg-dark-bg text-white overflow-hidden">
            <Navbar setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 overflow-hidden mx-0">
                <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {pathname.startsWith("/space") ? (
                <main className="flex-1 py-6  overflow-y-auto">
                    <div className="main-content-centered">
                        <Outlet />
                    </div>
                </main>
                ) : (
                <main className="flex-1 py-6 xl:py-7 px-4 md:px-8 xl:px-40 overflow-y-auto">
                    <div className="main-content-centered">
                        <Outlet />
                    </div>
                </main>
                )}
                
            </div>

            <Footer />
        </div>
    );
}
