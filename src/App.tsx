import { Outlet } from "react-router-dom";
        
import UniversiHeader from '@/components/UniversiHeader'

export function App() {
  return (
    <div className="App">
      <UniversiHeader />
      <Outlet/>
      {/*todo: Footer*/}
    </div>
  );
}
