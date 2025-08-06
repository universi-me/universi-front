import { Outlet, useNavigation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/Theme";
import LoadingSpinner from "@/components/LoadingSpinner";
import UniversiHeader from "@/components/UniversiHeader";
import useUmami from "@/hooks/useUmami";
import { AuthProvider } from "@/contexts/Auth";
import { YouTubePlayerProvider } from "@/contexts/YouTube";

import "./App.less";

export function App() {
    useUmami();
    const navigation = useNavigation();

    return (
        <AuthProvider>
            <YouTubePlayerProvider>
                <ThemeProvider>
                    <div id="App">
                        <UniversiHeader />

                        <div id="app-main">
                            { navigation.location
                                ? <LoadingSpinner noOverlay/>
                                : <Outlet />
                            }
                        </div>
                    </div>
                </ThemeProvider>
            </YouTubePlayerProvider>
        </AuthProvider>
    );
}
