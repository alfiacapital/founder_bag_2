import React, { useState, useEffect } from "react";
import SideBar from "../parts/SideBar.jsx";
import Footer from "../parts/Footer.jsx";
import Navbar from "../parts/Navbar.jsx";
import {Outlet, useLocation} from "react-router-dom";

export default function MainLayout() {
    const {pathname} = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(pathname.startsWith("/space") ? false : true); 
    useEffect(() => {
        setSidebarOpen(pathname.startsWith("/space") ? false : true);
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
