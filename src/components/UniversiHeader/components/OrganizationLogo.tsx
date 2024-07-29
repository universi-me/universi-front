import { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "@/contexts/Auth";
import { groupHeaderUrl } from "@/utils/apiUtils";

export function OrganizationLogo() {
    const authContext = useContext(AuthContext);

    const wrapperAttributes = {
        id: "header-logo",

        children: <img
            src={groupHeaderUrl(authContext.organization)}
            className="organization-logo"
            alt={authContext.organization.name}
            title={authContext.organization.name}
        />
    };

    return authContext.profile
        ? <Link {...wrapperAttributes} to={`/group${authContext.organization.path}`} />
        : <div {...wrapperAttributes}/>
}
