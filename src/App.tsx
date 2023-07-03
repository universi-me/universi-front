import { Outlet } from "react-router-dom";
        
import UniversiHeader from '@/components/UniversiHeader';
import UniversiFooter from "@/components/UniversiFooter"

export function App() {
  return (
    <div className="App">
      <UniversiHeader />
      <Outlet/>
      <UniversiFooter/>
    </div>
  );
}
