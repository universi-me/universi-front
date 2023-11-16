import { Link } from "react-router-dom";
import { WelcomeUser } from "./components/WelcomeUser/WelcomeUser";
import { LoginButton } from "./components/LoginButton/LoginButton";
import "./styles.less";


export function Header() {
    return (
    <header id="header">
      <div className="logo-container">
          <img src="/assets/imgs/universi-me2.png"/>
      </div>
      <div className="left-items">
        <Link to="/" id="header-logo">
        <img src={getHeaderLogoUrl()} className="organization-logo" alt="" />
        </Link>
      </div>
      <div className="right-items">
        <WelcomeUser />
      </div>
    </header>
  );
}

function getHeaderLogoUrl() {
    const match = REGEXP_MATCH_SUBDOMAIN.exec(location.hostname);
    let subdomain = match ? match[1] : undefined;

    if (!subdomain)
        subdomain = "codata";

    return `/assets/imgs/organization-headers/${subdomain}.png`
}

const REGEXP_MATCH_SUBDOMAIN = /^(?:[a-z]{3,5}:\/\/)?([^\.]*)?\.universi\.me/;
