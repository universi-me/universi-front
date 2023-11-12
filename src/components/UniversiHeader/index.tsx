import { Link } from "react-router-dom";
import { WelcomeUser } from "./components/WelcomeUser/WelcomeUser";
import { LoginButton } from "./components/LoginButton/LoginButton";
import "./styles.less";
import { useContext } from "react";
import { AuthContext } from "@/contexts/Auth";
import { groupImageUrl } from "@/utils/apiUtils";


export function Header() {
  const logo = getLogo();

  function getLogo(){
  const authContext = useContext(AuthContext)

    if(authContext?.organization){
      return <img  className="organization-logo" src={`${groupImageUrl(authContext.organization)}`}></img>
    }

    return <div id="header-logo">{location.href.split("/")[2].split(".")[0]}</div>

  }

  return (
    <header id="header">
      <div className="logo-container">
        {logo}
      </div>
      <div className="left-items">
        <Link to="/" id="header-logo">
          Universi<span className="tld">.me</span>
        </Link>
      </div>
      <div className="right-items">
        <WelcomeUser />
        <LoginButton />
      </div>
    </header>
  );
}
