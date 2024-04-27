import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/pages/Settings/GroupThemeColorPage/ThemeContext";
import { Header } from "@/components/UniversiHeader";
import useUmami from "./hooks/useUmami";

export function App() {
  useUmami();
  return (
    <ThemeProvider>
    <div className="App">
      <Header />
      <Outlet />
      {/*todo: Footer*/}
    </div>
    </ThemeProvider>
  );
}