import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../layout/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import ReportsLayout from "../layout/ReportsLayout.jsx";
import Reports from "../pages/Reports.jsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.jsx";
import TaskBoard from "../pages/space/TaskBoard.jsx";
import Test from "../pages/Test.jsx";
import Note from "../pages/note/Note.jsx";
import Notes from "@/pages/note/Notes.jsx";


export const router = createBrowserRouter([
    {
        element: <AuthenticatedLayout />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: "/",
                        element: <Home />
                    },
                    {
                        path: "/space/:id/board",
                        element: <TaskBoard />
                    },
                    {
                        path: "/notes",
                        element: <Notes />
                    },
                    {
                        path: "/note/:id",
                        element: <Note />
                    },

                ]
            },
            {
                element: <ReportsLayout />,
                children: [
                    {
                        path: "/reports",
                        element: <Reports />,
                    }
                ]
            },

        ],
    },
    {
        path: "*",
        element: <NotFound />
    },
    {
        path: "/test",
        element: <Test />
    },
])
