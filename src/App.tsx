import { Outlet } from "react-router-dom";

export function App() {
  return (
    //exemplo:
    <div className="App">
      //todo: Header
      <Outlet/>
      //todo: Footer
    </div>
  );
}
