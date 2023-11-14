import { Link } from "react-router-dom";
import { WelcomeUser } from "./components/WelcomeUser/WelcomeUser";
import { LoginButton } from "./components/LoginButton/LoginButton";
import "./styles.less";
import { useContext } from "react";
import { AuthContext } from "@/contexts/Auth";
import { groupBannerUrl, groupImageUrl } from "@/utils/apiUtils";


export function Header() {
  const logo = getLogo();

  function getLogo(){
  const authContext = useContext(AuthContext)

    if(authContext?.organization){
      return <img  className="organization-logo" src={`${groupBannerUrl(authContext.organization)}`}></img>
    }

    return <></>

  }

  return (
    <header id="header">
      <div className="logo-container">
          <img src="/assets/imgs/universi-me2.png"/>
      </div>
      <div className="left-items">
        <Link to="/" id="header-logo">
        {logo}
        </Link>
      </div>
      <div className="right-items">
        <WelcomeUser />
        <LoginButton />
      </div>
    </header>
  );
}
