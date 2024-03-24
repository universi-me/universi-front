import { useContext } from "react";

import { GroupContext } from "@/pages/Group";
import { groupBannerUrl } from "@/utils/apiUtils";

import "./GroupIntro.less";

export function GroupIntro() {
    const groupContext = useContext(GroupContext);

    return (
        groupContext === null ? null :

        <div id="group-intro">
            <div id="banner-wrapper">
                <img id="organization-banner" src={groupBannerUrl(groupContext.group)} />
                <div className="image-overlay"></div>
                <h3 id="group-name">
                    { groupContext.group.name }
                </h3>
            </div>
        </div>
    );
}
