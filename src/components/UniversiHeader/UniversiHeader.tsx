import { createRef, useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "@/contexts/Auth";
import { WelcomeUser } from "./components/WelcomeUser/WelcomeUser";
import { IMG_UNIVERSI_LOGO } from "@/utils/assets";
import { groupHeaderUrl } from "@/utils/apiUtils";

import "./styles.less";

export function UniversiHeader() {
    const authContext = useContext(AuthContext);
    const imageLogoRef = createRef<HTMLImageElement>();

    function imgLogoLoadError() {
        if (!imageLogoRef.current) return;

        imageLogoRef.current.src = "";
    }

    return (
        <header id="header">
            {authContext?.profile &&
                <div className="logo-container">
                    <img src={IMG_UNIVERSI_LOGO} />
                </div>
            }

            <div className="left-items">
                {authContext.organization &&
                    <Link to={`/group${authContext.organization.path}`} id="header-logo">
                        <img src={groupHeaderUrl(authContext.organization!)}
                            className="organization-logo" onError={imgLogoLoadError}
                            ref={imageLogoRef} title={authContext.organization?.name}
                        />

                        {imageLogoRef.current?.src === undefined && authContext.organization.name}
                    </Link>
                }
            </div>
            <div className="right-items">
                <WelcomeUser />
            </div>
        </header>
    );
}