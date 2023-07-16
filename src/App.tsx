import { Outlet } from "react-router-dom";
        
import UniversiHeader from '@/components/UniversiHeader';
import UniversiFooter from "@/components/UniversiFooter"

export function App() {
  return (
    <div className="App">
      <div className="application-content-wrapper">
        <UniversiHeader />
        <Outlet/>
      </div>
      <UniversiFooter/>
    </div>
  );
}
