import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "@/services/routes";
import {RouterProvider} from 'react-router-dom'

import { AuthProvider } from "./contexts/Auth/AuthProvider";
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import '@/layouts/global.less'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>

  </React.StrictMode>
);
