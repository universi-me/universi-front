import { useContext } from "react";
import { Link } from "react-router-dom";

import { GroupContext } from "@/pages/Group";
import { groupBannerUrl } from "@/utils/apiUtils";

import "./GroupIntro.less";

export function GroupIntro() {
    const groupContext = useContext(GroupContext);
    const organization = groupContext?.group.organization ?? undefined;

    return (
        groupContext === null ? null :

        <div id="group-intro">
            <div id="banner-wrapper">
                <img id="organization-banner" src={groupBannerUrl(groupContext.group)} />
                <h3 id="group-name">
                    { organization
                        ? <>
                            <Link to={`/group${organization.path}`}>{organization.name}</Link>
                            {" > "}
                            {groupContext.group.name}
                          </>
                        : null
                    }
                </h3>
            </div>
        </div>
    );
}
