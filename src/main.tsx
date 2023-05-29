import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./services/routes";
import {RouterProvider} from 'react-router-dom'
import './global.css'


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
