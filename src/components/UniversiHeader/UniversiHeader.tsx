import { useContext } from "react";

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
                <div className="logo-container">
                    <img src={IMG_UNIVERSI_LOGO} alt="Universi.me" />
                </div>
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
