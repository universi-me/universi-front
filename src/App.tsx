import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/contexts/Theme";
import UniversiHeader from "@/components/UniversiHeader";
import useUmami from "@/hooks/useUmami";
import { AuthProvider } from "@/contexts/Auth";
import { YouTubePlayerProvider } from "@/contexts/YouTube";

import "./App.less";

export function App() {
    useUmami();

    return (
        <AuthProvider>
            <YouTubePlayerProvider>
                <ThemeProvider>
                    <div id="App">
                        <UniversiHeader />

                        <div id="app-main">
                            <Outlet />
                        </div>
                    </div>
                </ThemeProvider>
            </YouTubePlayerProvider>
        </AuthProvider>
    );
}
