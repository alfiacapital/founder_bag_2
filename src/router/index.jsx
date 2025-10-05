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
            {
                element: <AlfiaAiLayout />,
                children: [
                    {
                        path: "/alfia-ai",
                        element: <AlfiaAI />
                    }
                ]
            },
            {
                path: "/calendar",
                element: <Calendar />
            },
            {
                path: "/space/:id/focus",
                element: <FocusModePage />
            }

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
