import {createContext, useContext, useEffect, useState} from "react";
import {setCookie, getCookie} from "../utils/cookieUtils";
import {axiosClient} from "../api/axios.jsx";

const UserContext = createContext();
export const UserProvider = ({children}) => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = getCookie("darkMode");
        return saved === "true";
    });
    const [user, setUser] = useState({})
    const [isLoading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        if (darkMode !== null) {
            setCookie("darkMode", darkMode, 365);
        }
    }, [darkMode]);


    const logout = async () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("login");
            setLoading(true)
            await axiosClient.post('/logout')
            setUser(null);
            setIsAuthenticated(false);
        }catch (e) {
            console.log(e);
        }finally {
            setLoading(false)
        }
    }
    return (
        <UserContext.Provider value={{darkMode, setDarkMode, user, setUser, isLoading, setLoading,isAuthenticated, setIsAuthenticated, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context
};
