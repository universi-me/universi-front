import { Link } from "react-router-dom";
import { WelcomeUser } from "./components/WelcomeUser/WelcomeUser";
import { LoginButton } from "./components/LoginButton/LoginButton";
import { useContext, createRef } from "react";
import { AuthContext } from "@/contexts/Auth";
import { groupHeaderUrl } from "@/utils/apiUtils";
import "./styles.less";


export function Header() {
  const authContext = useContext(AuthContext);
  const imageLogoRef : any = createRef();

  function imgLogoLoadError(): any {
    imageLogoRef.current.onError = "";
    imageLogoRef.current.src = `/assets/imgs/organization-headers/codata.png`;
  }

    return (
    <header id="header">
      { authContext?.profile &&
        <div className="logo-container">
          <img src="/assets/imgs/universi-me2.png"/>
        </div>
      }
      <div className="left-items">
        <Link to={authContext?.profile ? `/group` + authContext.organization?.path as string : `/`} id="header-logo">
          <img src={groupHeaderUrl(authContext.organization!)} className="organization-logo" alt="" onError={imgLogoLoadError} ref={imageLogoRef} title={authContext.organization?.name} />
        </Link>
      </div>
      <div className="right-items">
        <WelcomeUser />
      </div>
    </header>
  );
}
