import React, { useState } from "react";
import SideBar from "../parts/SideBar.jsx";
import Footer from "../parts/Footer.jsx";
import Navbar from "../parts/Navbar.jsx";
import {Outlet} from "react-router-dom";

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
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
