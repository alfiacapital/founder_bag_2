import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../layout/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import ReportsLayout from "../layout/ReportsLayout.jsx";
import Reports from "../pages/Reports.jsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.jsx";
import TaskBoard from "../pages/space/TaskBoard.jsx";
import Test from "../pages/Test.jsx";
import NovelEditorDemo from "../pages/NovelEditorDemo.jsx";


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
                        path: "/test",
                        element: <Test />
                    },
                    {
                        path: "/novel-editor",
                        element: <NovelEditorDemo />
                    }

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
    }
])
