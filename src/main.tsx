import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from 'react-router-dom'

import { router } from "@/services/routes";
import { AuthProvider } from "@/contexts/Auth";
import { YouTubePlayerProvider } from "@/contexts/YouTube";

import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'sweetalert2/dist/sweetalert2.min.css'

import '@/layouts/global.less'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
        <YouTubePlayerProvider>
            <RouterProvider router={router}/>
        </YouTubePlayerProvider>
    </AuthProvider>

    <div id="modal-container" />
  </React.StrictMode>
);
