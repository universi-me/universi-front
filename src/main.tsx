import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "@/services/routes";
import {RouterProvider} from 'react-router-dom'
import '@/layouts/global.less'


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
