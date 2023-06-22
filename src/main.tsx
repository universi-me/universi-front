import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./services/routes";
import {RouterProvider} from 'react-router-dom'
import './global.css'
import { AuthProvider } from "./contexts/Auth/AuthProvider";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>

  </React.StrictMode>
);
