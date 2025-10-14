import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../layout/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import ReportsLayout from "../layout/ReportsLayout.jsx";
import Reports from "../pages/Reports.jsx";
import AuthenticatedLayout from "../layout/AuthenticatedLayout.jsx";
import TaskBoard from "../pages/space/TaskBoard.jsx";
import FocusModePage from "../pages/space/FocusModePage.jsx";
import ArchivedSpaces from "../pages/space/ArchivedSpaces.jsx";
import Test from "../pages/Test.jsx";
import Note from "../pages/note/Note.jsx";
import Notes from "@/pages/note/Notes.jsx";
import TrashedNotes from "../pages/note/TrashedNotes.jsx";
import Calendar from "@/pages/calendar/Calendar.jsx";
import AlfiaAI from "@/pages/alfia-ai/AlfiaAI.jsx";
import AlfiaAiLayout from "@/layout/AlfiaAiLayout.jsx";
import SecondHome from "@/pages/SecondHome.jsx";
import TestError from "@/pages/TestError.jsx";
import RouterErrorPage from "@/pages/RouterErrorPage.jsx";
import Templates from "@/pages/Templates.jsx";

export const router = createBrowserRouter([
    {
        errorElement: <RouterErrorPage />,
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
                    {
                        path: "/archived-spaces",
                        element: <ArchivedSpaces />
                    },
                    {
                        path: "/trashed-notes",
                        element: <TrashedNotes />
                    },
                    {
                        path: "/v2",
                        element: <SecondHome />
                    },
                    {
                        path: "/templates",
                        element: <Templates />
                    }
                ]
            },
            {
                element: <ReportsLayout />,
                errorElement: <RouterErrorPage />,
                children: [
                    {
                        path: "/reports",
                        element: <Reports />,
                        errorElement: <RouterErrorPage />
                    }
                ]
            },
            {
                element: <AlfiaAiLayout />,
                errorElement: <RouterErrorPage />,
                children: [
                    {
                        path: "/alfia-ai",
                        element: <AlfiaAI />,
                        errorElement: <RouterErrorPage />
                    }
                ]
            },
            {
                path: "/calendar",
                element: <Calendar />,
                errorElement: <RouterErrorPage />
            },
            {
                path: "/space/:id/focus",
                element: <FocusModePage />,
                errorElement: <RouterErrorPage />
            }

        ],
    },
    {
        path: "*",
        element: <NotFound />
    },
    {
        path: "/test",
        element: <Test />,
        errorElement: <RouterErrorPage />
    },
])