import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/pages/Settings/GroupThemeColorPage/ThemeContext";
import { Header } from "@/components/UniversiHeader";

export function App() {
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