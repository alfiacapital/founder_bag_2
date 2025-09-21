import React from 'react'
import {RouterProvider} from "react-router-dom";
import {router} from "./router/index.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ToastContainer} from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";

const queryClient = new QueryClient()


function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer />
      </QueryClientProvider>
  )
}

export default App
