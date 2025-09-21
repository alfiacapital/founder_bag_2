import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserProvider";
import { Outlet, useNavigate } from "react-router-dom";
import { axiosClient } from "../api/axios";
import {useQuery} from "@tanstack/react-query";
import Loader from "../components/Loader.jsx";


function AuthenticatedLayout() {
    const { setUser, setIsAuthenticated, isAuthenticated, user } = useUserContext();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [isLoaderVisible, setIsLoaderVisible] = useState(true);

    useEffect(() => {
        const duration = 1500;
        const intervalTime = 50;
        const increment = (100 / (duration / intervalTime));

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) return prev + increment;
                return prev;
            });
        }, intervalTime);

        const timer = setTimeout(() => {
            clearInterval(interval);
            setIsLoaderVisible(false);
        }, duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [progress]);

    const { isLoading, isError } = useQuery({
        queryKey: ["authCheck"],
        queryFn: async () => {
            const res = await axiosClient.get('/verify');
            if (res.status === 200) {
                localStorage.setItem("login", "true");
                setIsAuthenticated(true);
                setUser(res.data.user);
                return res.data.user;
            }
            throw new Error("Unauthorized");
        },
        onError: () => {
            localStorage.clear();
            setIsAuthenticated(false);
            setUser(null);
            navigate("/sign-in", { replace: true });
        },
        retry: false,
        refetchOnWindowFocus: false,
    });



    if (isLoaderVisible || isLoading) {
        return <Loader progress={progress} /> ;
    }

    if (isError || !isAuthenticated) {
        window.location.href = import.meta.env.VITE_MAIN_APP_URL;
        return null;
    }


    if (user && user.solanaAddress && user.isCompletedWeb3 === false) {
        window.location.href = import.meta.env.VITE_MAIN_APP_URL;
        return null;
    }

    return !isAuthenticated ? <Loader /> : <Outlet />;
}

export default AuthenticatedLayout;
