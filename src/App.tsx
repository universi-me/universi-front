import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/contexts/Theme";
import UniversiHeader from "@/components/UniversiHeader";
import useUmami from "./hooks/useUmami";

import "./App.less";

export function App() {
    useUmami();

    return (
        <ThemeProvider>
            <div id="App">
                <UniversiHeader />

                <div id="app-main">
                    <Outlet />
                </div>
            </div>
        </ThemeProvider>
    );
}
