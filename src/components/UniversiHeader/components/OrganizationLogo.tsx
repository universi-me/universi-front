import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AuthContext from "@/contexts/Auth";
import { groupHeaderUrl } from "@/utils/apiUtils";

export function OrganizationLogo() {
    const authContext = useContext(AuthContext);
    const [renderLogoImage, setRenderLogoImage] = useState(true);

    useEffect(() => {
        setRenderLogoImage(true);
    }, [authContext.organization, authContext.profile]);

    const wrapperAttributes = {
        id: "header-logo",

        children: renderLogoImage
            ? <img
                src={groupHeaderUrl(authContext.organization)}
                onError={toggleRenderImage}
                className="organization-logo"
                title={authContext.organization.name}
            />
            : <div>
                { authContext.organization.name }
            </div>
    };

    return authContext.profile
        ? <Link {...wrapperAttributes} to={`/group${authContext.organization.path}`} />
        : <div {...wrapperAttributes}/>

    function toggleRenderImage() {
        setRenderLogoImage(b => !b);
    }
}
