import React, { useState } from "react";
import SideBar from "../parts/SideBar.jsx";
import Footer from "../parts/Footer.jsx";
import Navbar from "../parts/Navbar.jsx";
import {Outlet, useLocation} from "react-router-dom";

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {pathname} = useLocation()
    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
            <Navbar setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 overflow-hidden mx-0">
                {!pathname.startsWith("/space/") && (
                <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                )}
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
