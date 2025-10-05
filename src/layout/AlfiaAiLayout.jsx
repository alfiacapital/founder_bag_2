import React, { useState } from "react";
import SideBar from "../parts/SideBar.jsx";
import Footer from "../parts/Footer.jsx";
import Navbar from "../parts/Navbar.jsx";
import {Outlet, useLocation} from "react-router-dom";

export default function AlfiaAiLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {pathname} = useLocation();
    
    return (
        <div className="flex flex-col h-screen bg-dark-bg text-white overflow-hidden">
            <Navbar setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 overflow-hidden">
                {!pathname.startsWith("/space/") && (
                    <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                )}
                <main className="flex-1 overflow-hidden">
                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>
    );
}
