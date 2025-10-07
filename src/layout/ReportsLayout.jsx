import React from 'react';
import Footer from "../parts/Footer.jsx";
import {IoIosArrowBack} from "react-icons/io";
import {Outlet, useNavigate} from "react-router-dom";
import UserMenu from "@/components/UserMenu";

function ReportsLayout() {
    const navigate = useNavigate();
    return (
        <div className={"flex flex-col h-screen bg-dark-bg1 text-dark-text1 overflow-hidden"}>
            {/* TOP BAR */}
            <div className={"flex items-center justify-between px-4 md:px-6 py-5   bg-dark-bg2 border-b border-dark-stroke"}>
                <div className={"flex items-center space-x-4"}>
                    <div onClick={() => navigate("/")}
                        className={"flex items-center font-medium text-dark-text2 cursor-pointer hover:text-dark-text1 transition duration-300 ease-in-out"}>
                        <IoIosArrowBack className={"text-md"} />
                        <span className={"mt-1 text-sm"}>BACK</span>
                    </div>
                    <div className={"text-dark-text1 text-xl text-xm font-bold pt-1"}> Reports</div>
                </div>
                <nav className="hidden md:flex items-center space-x-3  ">
                    <span

                        className="cursor-pointer text-sm border border-dark-stroke rounded-button px-4 py-2 hover:border-dark-stroke text-dark-text1 hover:text-dark-text1 hover:border-dark-stroke hover:bg-dark-hover font-bold
                        transition-all duration-300"
                    >
                        Support Portal
                    </span>
                    <span

                        className="cursor-pointer text-sm border border-dark-stroke rounded-button px-4 py-2 hover:border-dark-stroke text-dark-text1 hover:text-dark-text1 hover:border-dark-stroke hover:bg-dark-hover font-bold
                     transition-all duration-300"
                    >
                        Manage Funds
                    </span>
                    <span

                        className="cursor-pointer text-sm border border-dark-stroke rounded-button px-4 py-2 hover:border-dark-stroke text-dark-text2 hover:text-dark-text1 hover:border-dark-stroke hover:bg-dark-hover font-bold
                     transition-all duration-300"
                    >
                        Docs
                    </span>
                    <UserMenu />

                </nav>

            </div>

            {/* CONTENT */}
            <div className={"flex-1 py-6 xl:py-7 px-4 md:px-8 xl:px-20 overflow-y-auto bg-dark-bg"}>
                <div className="main-content-centered ">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ReportsLayout;
