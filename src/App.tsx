import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/pages/Settings/GroupThemeColorPage/ThemeContext";
import { Header } from "@/components/UniversiHeader";
import useUmami from "./hooks/useUmami";

import "./App.less";

export function App() {
    useUmami();

    return (
        <ThemeProvider>
            <div id="App">
                <Header />

                <div id="app-main">
                    <Outlet />
                </div>
            </div>
        </ThemeProvider>
    );
}
