import { Outlet } from "react-router-dom";

import { Header } from "@/components/UniversiHeader";

export function App() {
  return (
    <div className="App">
      <Header />
      <Outlet />
      {/*todo: Footer*/}
    </div>
  );
}
