import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/contexts/Auth";
import SinginForm from "./SinginForm";
import "./signin.css";

export default function Singin() {
    const authContext = useContext(AuthContext);
    if (authContext.profile)
        return <Navigate to="/" />

    return (
    <div>
      <footer className="waves-footer">
        <div className="waves">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill-opacity="1"
              d="M0,160L60,133.3C120,107,240,53,360,74.7C480,96,600,192,720,245.3C840,299,960,309,1080,309.3C1200,309,1320,299,1380,293.3L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </footer>
      <div className="signin-container">
        <div className="logo">
          {/* <UniversiLogo /> */}
          <img src="/assets/imgs/universi-me2.png" alt="Universi.me" className="logo-login"/>

          <h1>Sua plataforma de desenvolvimento pessoal</h1>
        </div>

        <div className="signin">
          <SinginForm></SinginForm>
        </div>
      </div>
    </div>
  );
}
