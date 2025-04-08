import { useContext } from "react";
import { Link } from "react-router";

import AuthContext from "@/contexts/Auth";
import { WelcomeUser } from "./components/WelcomeUser/WelcomeUser";
import { IMG_UNIVERSI_LOGO } from "@/utils/assets";

import "./styles.less";
import { OrganizationLogo } from "./components/OrganizationLogo";

export function UniversiHeader() {
    const authContext = useContext(AuthContext);

    return (
        <header id="header">
            { authContext.profile &&
                <Link className="logo-container" to="/">
                    <img src={IMG_UNIVERSI_LOGO} alt="Universi.me" />
                </Link>
            }

            <div className="left-items">
                <OrganizationLogo />
            </div>

            <div className="right-items">
                <WelcomeUser />
            </div>
        </header>
    );
}
