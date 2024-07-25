import { createRef, useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "@/contexts/Auth";
import { groupHeaderUrl } from "@/utils/apiUtils";

export function OrganizationLogo() {
    const authContext = useContext(AuthContext);
    const imageLogoRef = createRef<HTMLImageElement>();

    function imgLogoLoadError() {
        if (!imageLogoRef.current) return;

        imageLogoRef.current.src = "";
    }

    const wrapperAttributes = {
        id: "header-logo",

        children: <>
            <img src={groupHeaderUrl(authContext.organization)}
                className="organization-logo" onError={imgLogoLoadError}
                ref={imageLogoRef} title={authContext.organization?.name}
            />

            { imageLogoRef.current?.src === undefined && authContext.organization.name }
        </>
    };

    return authContext.profile
        ? <Link {...wrapperAttributes} to={`/group${authContext.organization.path}`} />
        : <p {...wrapperAttributes}/>
}
